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
            image_url_2 TEXT DEFAULT \'\',
            image_url_3 TEXT DEFAULT \'\',
            description TEXT DEFAULT \'\',
            brand TEXT DEFAULT \'\',
            sizes TEXT DEFAULT \'\',
            is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
        );'
    );

    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);
    if (!in_array('subcategory', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN subcategory TEXT NOT NULL DEFAULT ''");
    }
    if (!in_array('description', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN description TEXT DEFAULT ''");
    }
    if (!in_array('brand', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN brand TEXT DEFAULT ''");
    }
    if (!in_array('sizes', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN sizes TEXT DEFAULT ''");
    }
    if (!in_array('image_url_2', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN image_url_2 TEXT DEFAULT ''");
    }
    if (!in_array('image_url_3', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN image_url_3 TEXT DEFAULT ''");
    }
}

function seed(PDO $pdo): void
{
    $count = (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    if ($count > 0) {
        return;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO products (name, category, subcategory, image_url, image_url_2, image_url_3, description, brand, sizes, is_active)
         VALUES (:name, :category, :subcategory, :image_url, :image_url_2, :image_url_3, :description, :brand, :sizes, :is_active)'
    );

    $rows = [
        ['Cadeira de Rodas Standard', 'Mobilidade', 'Cadeiras de Rodas', 'https://example.com/img/cadeira-rodas-standard.jpg', 'https://example.com/img/cadeira-rodas-standard-2.jpg', 'https://example.com/img/cadeira-rodas-standard-3.jpg', 'Cadeira de rodas padrão para uso diário com estrutura resistente.', 'Marca A', 'P,M,G,GG', 1],
        ['Cadeira de Rodas Todo-Terreno', 'Mobilidade', 'Cadeiras de Rodas', 'https://example.com/img/cadeira-rodas-todoterreno.jpg', '', '', 'Cadeira de rodas preparada para terrenos irregulares.', 'Marca B', 'M,G', 1],
        ['Andador Fixo Dobrável', 'Mobilidade', 'Andadores', 'https://example.com/img/andador-fixo.jpg', '', '', 'Andador fixo dobrável para facilitar o transporte.', 'Marca A', 'Único', 1],
        ['Assento de Banho Reversível', 'Banho e Higiene', 'Banho', 'https://example.com/img/assento-banho.jpg', '', '', 'Assento de banho reversível para maior praticidade.', 'Marca C', 'P,M,G', 1],
        ['Barra de Apoio para Banheiro', 'Banho e Higiene', 'Banho', 'https://example.com/img/corrimao-banheiro.jpg', '', '', 'Barra de apoio para segurança no banheiro.', 'Marca C', 'Único', 0],
        ['Kit de Talheres com Cabo Engrossado', 'Vida Diária', 'Alimentação', 'https://example.com/img/talheres-engrossados.jpg', '', '', 'Kit de talheres com cabos engrossados para melhor manuseio.', 'Marca D', 'Único', 1],
        ['Almofada Antiescaras', 'Apoio Postural', 'Assentos', 'https://example.com/img/almofada-assento.jpg', '', '', 'Almofada antiescaras para maior conforto.', 'Marca E', 'P,M', 1],
        ['Almofada Postural Multiuso', 'Apoio Postural', 'Assentos', 'https://example.com/img/almofada-postural.jpg', '', '', 'Almofada postural multiuso com alta densidade.', 'Marca E', 'M,G', 1],
        ['Capa de Chuva para Cadeira de Rodas', 'Acessórios', 'Cadeiras de Rodas', 'https://example.com/img/capa-chuva-cadeira.jpg', '', '', 'Capa de chuva impermeável para cadeira de rodas.', 'Marca F', 'Único', 1],
    ];

    foreach ($rows as [$name, $category, $subcategory, $image_url, $image_url_2, $image_url_3, $description, $brand, $sizes, $is_active]) {
        $stmt->execute([
            ':name' => $name,
            ':category' => $category,
            ':subcategory' => $subcategory,
            ':image_url' => $image_url,
            ':image_url_2' => $image_url_2,
            ':image_url_3' => $image_url_3,
            ':description' => $description,
            ':brand' => $brand,
            ':sizes' => $sizes,
            ':is_active' => $is_active,
        ]);
    }
}

$pdo = db();
migrate($pdo);
seed($pdo);

echo 'Database initialized at ' . db_path() . PHP_EOL;