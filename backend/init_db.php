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
            image_url TEXT NOT NULL DEFAULT \'\',
            is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
        );'
    );
}

function seed(PDO $pdo): void
{
    $count = (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    if ($count > 0) {
        return;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO products (name, category, image_url, is_active)
         VALUES (:name, :category, :image_url, :is_active)'
    );

    $rows = [
        ['Cadeira de Rodas Standard', 'Mobilidade', 'https://example.com/img/cadeira-rodas-standard.jpg', 1],
        ['Cadeira de Rodas Todo-Terreno', 'Mobilidade', 'https://example.com/img/cadeira-rodas-todoterreno.jpg', 1],
        ['Andador Fixo Dobrável', 'Mobilidade', 'https://example.com/img/andador-fixo.jpg', 1],
        ['Assento de Banho Reversível', 'Banho e Higiene', 'https://example.com/img/assento-banho.jpg', 1],
        ['Barra de Apoio para Banheiro', 'Banho e Higiene', 'https://example.com/img/corrimao-banheiro.jpg', 0],
        ['Kit de Talheres com Cabo Engrossado', 'Vida Diária', 'https://example.com/img/talheres-engrossados.jpg', 1],
        ['Almofada Antiescaras', 'Apoio Postural', 'https://example.com/img/almofada-assento.jpg', 1],
        ['Almofada Postural Multiuso', 'Apoio Postural', 'https://example.com/img/almofada-postural.jpg', 1],
        ['Capa de Chuva para Cadeira de Rodas', 'Acessórios', 'https://example.com/img/capa-chuva-cadeira.jpg', 1],
    ];

    foreach ($rows as [$name, $category, $image_url, $is_active]) {
        $stmt->execute([
            ':name' => $name,
            ':category' => $category,
            ':image_url' => $image_url,
            ':is_active' => $is_active,
        ]);
    }
}

$pdo = db();
migrate($pdo);
seed($pdo);

echo 'Database initialized at ' . db_path() . PHP_EOL;