<?php

declare(strict_types=1);

require __DIR__ . '/database.php';

/**
 * Migração aditiva/idempotente: atualiza category/subcategory de produtos
 * existentes para a nova taxonomia (por id ou por nome conhecido).
 * Não altera esquema, não apaga tabelas e não remove dados.
 */
$pdo = db();

$mappings = [
    ['id' => 2, 'category' => 'Mobilidade', 'subcategory' => 'Cadeiras de Rodas'],
    ['id' => 3, 'category' => 'Mobilidade', 'subcategory' => 'Andadores'],
    ['id' => 4, 'category' => 'Banho e Higiene', 'subcategory' => 'Assentos e Cadeiras de Banho'],
    ['id' => 5, 'category' => 'Banho e Higiene', 'subcategory' => 'Barras de Segurança'],
    ['id' => 6, 'category' => 'Vida Diária', 'subcategory' => 'Talheres Adaptados'],
    ['id' => 7, 'category' => 'Apoio Postural', 'subcategory' => 'Almofadas de Espuma'],
    ['id' => 8, 'category' => 'Apoio Postural', 'subcategory' => 'Almofadas de Espuma'],
    ['id' => 9, 'category' => 'Acessórios e Peças', 'subcategory' => 'Protetores'],
    ['id' => 17, 'category' => 'Vida Diária', 'subcategory' => 'Auxiliares'],
];

$nameMappings = [
    // Mapeamentos por nome para alinhar bases que sigam o seed antigo
    ['name' => 'Cadeira de Rodas Standard', 'category' => 'Mobilidade', 'subcategory' => 'Cadeiras de Rodas'],
    ['name' => 'Cadeira de Rodas Todo-Terreno', 'category' => 'Mobilidade', 'subcategory' => 'Cadeiras de Rodas'],
    ['name' => 'Andador Fixo Dobrável', 'category' => 'Mobilidade', 'subcategory' => 'Andadores'],
    ['name' => 'Andador com Rodas e Freio', 'category' => 'Mobilidade', 'subcategory' => 'Andadores'],
    ['name' => 'Assento de Banho Reversível', 'category' => 'Banho e Higiene', 'subcategory' => 'Assentos e Cadeiras de Banho'],
    ['name' => 'Cadeira de Banho com Rodas', 'category' => 'Banho e Higiene', 'subcategory' => 'Assentos e Cadeiras de Banho'],
    ['name' => 'Barra de Apoio para Banheiro', 'category' => 'Banho e Higiene', 'subcategory' => 'Barras de Segurança'],
    ['name' => 'Kit de Talheres com Cabo Engrossado', 'category' => 'Vida Diária', 'subcategory' => 'Talheres Adaptados'],
    ['name' => 'Abridor de Pote Adaptável', 'category' => 'Vida Diária', 'subcategory' => 'Auxiliares'],
    ['name' => 'Calçadeira de Cabo Longo', 'category' => 'Vida Diária', 'subcategory' => 'Auxiliares'],
    ['name' => 'Almofada Antiescaras', 'category' => 'Apoio Postural', 'subcategory' => 'Almofadas de Espuma'],
    ['name' => 'Suporte Lombar Anatômico', 'category' => 'Ortopedia e Suporte', 'subcategory' => 'Tronco e Costas'],
    ['name' => 'Almofada Postural Multiuso', 'category' => 'Apoio Postural', 'subcategory' => 'Almofadas de Espuma'],
    ['name' => 'Alça de Levantamento', 'category' => 'Vida Diária', 'subcategory' => 'Auxiliares'],
    ['name' => 'Capa de Chuva para Cadeira de Rodas', 'category' => 'Acessórios e Peças', 'subcategory' => 'Protetores'],
    ['name' => 'Bandeja Ajustável para Cadeira', 'category' => 'Acessórios e Peças', 'subcategory' => 'Peças de Reposição'],
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

    $pdo->commit();
    echo "Migração de categorias concluída.\n";
} catch (Throwable $e) {
    $pdo->rollBack();
    fwrite(STDERR, 'Falha na migração: ' . $e->getMessage() . "\n");
    exit(1);
}
