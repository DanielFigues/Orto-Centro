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
            short_description TEXT DEFAULT \'\',
            technical_specs TEXT DEFAULT \'\',
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
    if (!in_array('short_description', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN short_description TEXT DEFAULT ''");
    }
    if (!in_array('technical_specs', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN technical_specs TEXT DEFAULT ''");
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
        ['Cadeira de Rodas Standard', 'Mobilidade', 'Cadeiras de Rodas', '/images/products/cadeira-rodas-standard.jpg', '/images/products/cadeira-rodas-standard.jpg', '/images/products/cadeira-rodas-todoterreno.jpg', 'Cadeira de rodas padrão para uso diário, com estrutura em aço resistente. Ideal para ambientes internos e externos com piso plano.', 'OrtoCentro', 'P,M,G,GG', 1],
        ['Cadeira de Rodas Todo-Terreno', 'Mobilidade', 'Cadeiras de Rodas', '/images/products/cadeira-rodas-todoterreno.jpg', '/images/products/cadeira-rodas-standard.jpg', '/images/products/andador-fixo.jpg', 'Cadeira de rodas todo-terreno com pneus maiores e estrutura reforçada para terrenos irregulares.', 'OrtoCentro', 'M,G,GG', 1],
        ['Andador Fixo Dobrável', 'Mobilidade', 'Andadores', '/images/products/andador-fixo.jpg', '/images/products/andador-rodas.jpg', '/images/products/suporte-lombar.jpg', 'Andador fixo dobrável com estrutura leve de alumínio para maior segurança na marcha.', 'OrtoCentro', 'Único', 1],
        ['Andador com Rodas e Freio', 'Mobilidade', 'Andadores', '/images/products/andador-rodas.jpg', '/images/products/andador-fixo.jpg', '/images/products/corrimao-banheiro.jpg', 'Andador com rodas e freios para auxiliar na locomoção com mais autonomia.', 'OrtoCentro', 'Único', 1],
        ['Assento de Banho Reversível', 'Banho e Higiene', 'Banho', '/images/products/assento-banho.jpg', '/images/products/cadeira-banho-rodas.jpg', '/images/products/corrimao-banheiro.jpg', 'Assento de banho reversível, resistente à umidade e com pés antiderrapantes.', 'OrtoCentro', 'P,M,G', 1],
        ['Cadeira de Banho com Rodas', 'Banho e Higiene', 'Banho', '/images/products/cadeira-banho-rodas.jpg', '/images/products/assento-banho.jpg', '/images/products/corrimao-banheiro.jpg', 'Cadeira de banho com rodas para fácil deslocamento no box com escoamento adequado da água.', 'OrtoCentro', 'M,G', 1],
        ['Barra de Apoio para Banheiro', 'Banho e Higiene', 'Banho', '/images/products/corrimao-banheiro.jpg', '/images/products/assento-banho.jpg', '/images/products/cadeira-banho-rodas.jpg', 'Barra de apoio para banheiro com fixação segura para maior estabilidade.', 'OrtoCentro', 'Único', 0],
        ['Kit de Talheres com Cabo Engrossado', 'Vida Diária', 'Alimentação', '/images/products/talheres-engrossados.jpg', '/images/products/abridor-adaptavel.jpg', '/images/products/calcadeira-longa.jpg', 'Talheres com cabos engrossados para facilitar o manuseio.', 'OrtoCentro', 'Único', 1],
        ['Abridor de Pote Adaptável', 'Vida Diária', 'Alimentação', '/images/products/abridor-adaptavel.jpg', '/images/products/talheres-engrossados.jpg', '/images/products/calcadeira-longa.jpg', 'Abridor de pote adaptável que proporciona maior alavancagem.', 'OrtoCentro', 'Único', 1],
        ['Calçadeira de Cabo Longo', 'Vida Diária', 'Vestuário', '/images/products/calcadeira-longa.jpg', '/images/products/talheres-engrossados.jpg', '/images/products/abridor-adaptavel.jpg', 'Calçadeira de cabo longo para auxiliar na colocação de calçados sem curvar-se.', 'OrtoCentro', 'Único', 1],
        ['Almofada Antiescaras', 'Apoio Postural', 'Assentos', '/images/products/almofada-assento.jpg', '/images/products/almofada-postural.jpg', '/images/products/suporte-lombar.jpg', 'Almofada antiescaras para redução de pressão e maior conforto.', 'OrtoCentro', 'P,M', 1],
        ['Suporte Lombar Anatômico', 'Apoio Postural', 'Colunas', '/images/products/suporte-lombar.jpg', '/images/products/almofada-assento.jpg', '/images/products/almofada-postural.jpg', 'Suporte lombar anatômico para manter a curvatura natural da coluna.', 'OrtoCentro', 'Único', 1],
        ['Almofada Postural Multiuso', 'Apoio Postural', 'Assentos', '/images/products/almofada-postural.jpg', '/images/products/almofada-assento.jpg', '/images/products/suporte-lombar.jpg', 'Almofada postural multiuso com alta densidade para maior conforto.', 'OrtoCentro', 'M,G', 1],
        ['Alça de Levantamento', 'Acessórios', 'Transferência', '/images/products/alca-levantar.jpg', '/images/products/capa-chuva-cadeira.jpg', '/images/products/tablet-bandeja.jpg', 'Alça de levantamento para auxiliar na transferência com segurança.', 'OrtoCentro', 'Único', 1],
        ['Capa de Chuva para Cadeira de Rodas', 'Acessórios', 'Cadeiras de Rodas', '/images/products/capa-chuva-cadeira.jpg', '/images/products/alca-levantar.jpg', '/images/products/tablet-bandeja.jpg', 'Capa de chuva impermeável para proteger em dias chuvosos.', 'OrtoCentro', 'Único', 1],
        ['Bandeja Ajustável para Cadeira', 'Acessórios', 'Cadeiras de Rodas', '/images/products/tablet-bandeja.jpg', '/images/products/capa-chuva-cadeira.jpg', '/images/products/alca-levantar.jpg', 'Bandeja ajustável para refeições, leitura ou atividades.', 'OrtoCentro', 'Único', 1],
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