<?php

declare(strict_types=1);

require __DIR__ . '/database.php';

function migrate(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT NOT NULL DEFAULT \'\',
            image_url TEXT NOT NULL DEFAULT \'\',
            is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
        );'
    );

    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);
    if (!in_array('subcategory', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN subcategory TEXT NOT NULL DEFAULT ''");
    }
}

function seed(PDO $pdo): void
{
    $count = (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    if ($count > 0) {
        return;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO products (name, category, subcategory, image_url, is_active)
         VALUES (:name, :category, :subcategory, :image_url, :is_active)'
    );

    $rows = [
        ['Cadeira de Rodas Standard', 'Mobilidade', 'Cadeiras de Rodas', 'https://example.com/img/cadeira-rodas-standard.jpg', 1],
        ['Cadeira de Rodas Todo-Terreno', 'Mobilidade', 'Cadeiras de Rodas', 'https://example.com/img/cadeira-rodas-todoterreno.jpg', 1],
        ['Andador Fixo Dobrável', 'Mobilidade', 'Andadores', 'https://example.com/img/andador-fixo.jpg', 1],
        ['Assento de Banho Reversível', 'Banho e Higiene', 'Banho', 'https://example.com/img/assento-banho.jpg', 1],
        ['Barra de Apoio para Banheiro', 'Banho e Higiene', 'Banho', 'https://example.com/img/corrimao-banheiro.jpg', 0],
        ['Kit de Talheres com Cabo Engrossado', 'Vida Diária', 'Alimentação', 'https://example.com/img/talheres-engrossados.jpg', 1],
        ['Almofada Antiescaras', 'Apoio Postural', 'Assentos', 'https://example.com/img/almofada-assento.jpg', 1],
        ['Almofada Postural Multiuso', 'Apoio Postural', 'Assentos', 'https://example.com/img/almofada-postural.jpg', 1],
        ['Capa de Chuva para Cadeira de Rodas', 'Acessórios', 'Cadeiras de Rodas', 'https://example.com/img/capa-chuva-cadeira.jpg', 1],
    ];

    foreach ($rows as [$name, $category, $subcategory, $image_url, $is_active]) {
        $stmt->execute([
            ':name' => $name,
            ':category' => $category,
            ':subcategory' => $subcategory,
            ':image_url' => $image_url,
            ':is_active' => $is_active,
        ]);
    }
}

$pdo = db();
migrate($pdo);
seed($pdo);

echo 'Database initialized at ' . db_path() . PHP_EOL;