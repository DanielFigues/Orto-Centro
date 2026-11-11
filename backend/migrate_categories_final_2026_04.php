<?php

declare(strict_types=1);

require __DIR__ . '/database.php';

/**
 * Additive/idempotent migration: align products to the final 8-category taxonomy.
 * No schema changes, no DROP, no row deletions.
 * Vida Diária and Acessórios e Peças are removed/renamed in taxonomy; products
 * without a natural fit are placed in Acessórios / Peças de Reposição (review).
 */
$pdo = db();

$mappings = [
    ['id' => 2, 'category' => 'Mobilidade', 'subcategory' => 'Cadeiras de Rodas'],
    ['id' => 3, 'category' => 'Mobilidade', 'subcategory' => 'Andadores'],
    ['id' => 4, 'category' => 'Banho e Higiene', 'subcategory' => 'Assentos e Cadeiras de Banho'],
    ['id' => 5, 'category' => 'Banho e Higiene', 'subcategory' => 'Barras de Segurança'],
    ['id' => 6, 'category' => 'Acessórios', 'subcategory' => 'Peças de Reposição'], // no natural fit (Vida Diária removed)
    ['id' => 7, 'category' => 'Apoio Postural', 'subcategory' => 'Almofadas de Espuma'],
    ['id' => 8, 'category' => 'Apoio Postural', 'subcategory' => 'Almofadas de Espuma'],
    ['id' => 9, 'category' => 'Acessórios', 'subcategory' => 'Protetores'],
    ['id' => 17, 'category' => 'Acessórios', 'subcategory' => 'Peças de Reposição'], // inactive test product, no natural fit
];

$nameMappings = [
    ['name' => 'Cadeira de Rodas Standard', 'category' => 'Mobilidade', 'subcategory' => 'Cadeiras de Rodas'],
    ['name' => 'Cadeira de Rodas Todo-Terreno', 'category' => 'Mobilidade', 'subcategory' => 'Cadeiras de Rodas'],
    ['name' => 'Andador Fixo Dobrável', 'category' => 'Mobilidade', 'subcategory' => 'Andadores'],
    ['name' => 'Andador com Rodas e Freio', 'category' => 'Mobilidade', 'subcategory' => 'Andadores'],
    ['name' => 'Assento de Banho Reversível', 'category' => 'Banho e Higiene', 'subcategory' => 'Assentos e Cadeiras de Banho'],
    ['name' => 'Cadeira de Banho com Rodas', 'category' => 'Banho e Higiene', 'subcategory' => 'Assentos e Cadeiras de Banho'],
    ['name' => 'Barra de Apoio para Banheiro', 'category' => 'Banho e Higiene', 'subcategory' => 'Barras de Segurança'],
    ['name' => 'Kit de Talheres com Cabo Engrossado', 'category' => 'Acessórios', 'subcategory' => 'Peças de Reposição'],
    ['name' => 'Abridor de Pote Adaptável', 'category' => 'Acessórios', 'subcategory' => 'Peças de Reposição'],
    ['name' => 'Calçadeira de Cabo Longo', 'category' => 'Acessórios', 'subcategory' => 'Peças de Reposição'],
    ['name' => 'Almofada Antiescaras', 'category' => 'Apoio Postural', 'subcategory' => 'Almofadas de Espuma'],
    ['name' => 'Suporte Lombar Anatômico', 'category' => 'Ortopedia e Suporte', 'subcategory' => 'Tronco e Costas'],
    ['name' => 'Almofada Postural Multiuso', 'category' => 'Apoio Postural', 'subcategory' => 'Almofadas de Espuma'],
    ['name' => 'Alça de Levantamento', 'category' => 'Acessórios', 'subcategory' => 'Peças de Reposição'],
    ['name' => 'Capa de Chuva para Cadeira de Rodas', 'category' => 'Acessórios', 'subcategory' => 'Protetores'],
    ['name' => 'Bandeja Ajustável para Cadeira', 'category' => 'Acessórios', 'subcategory' => 'Peças de Reposição'],
];

$pdo->beginTransaction();
try {
    $byId = $pdo->prepare('UPDATE products SET category = :category, subcategory = :subcategory WHERE id = :id');
    foreach ($mappings as $m) {
        $byId->execute($m);
    }

    $byName = $pdo->prepare(
        "UPDATE products SET category = :category, subcategory = :subcategory
         WHERE name = :name AND (category <> :category OR subcategory <> :subcategory)"
    );
    foreach ($nameMappings as $m) {
        $byName->execute($m);
    }

    // Generic cleanup for any remaining renamed/removed categories (additive remap)
    $cleanup = $pdo->prepare(
        "UPDATE products SET category = :new, subcategory = CASE
            WHEN :new = 'Acessórios' AND subcategory NOT IN ('Ponteiras','Protetores','Peças de Reposição') THEN 'Peças de Reposição'
            ELSE subcategory END
         WHERE category = :old"
    );
    $cleanup->execute([':old' => 'Acessórios e Peças', ':new' => 'Acessórios']);
    $cleanup->execute([':old' => 'Vida Diária', ':new' => 'Acessórios']);

    $pdo->commit();
    echo "Final category migration completed.\n";
} catch (Throwable $e) {
    $pdo->rollBack();
    fwrite(STDERR, 'Migration failed: ' . $e->getMessage() . "\n");
    exit(1);
}
