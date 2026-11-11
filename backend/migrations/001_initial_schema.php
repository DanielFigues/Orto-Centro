<?php

declare(strict_types=1);

/**
 * 001_initial_schema: cria a tabela products completa (CREATE TABLE IF NOT EXISTS)
 * e adiciona, de forma protegida, as colunas históricas em bancos já existentes.
 * Aditiva e idempotente: nunca remove ou altera dados.
 */
return function (PDO $pdo): void {
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

    $additions = [
        'subcategory' => "ALTER TABLE products ADD COLUMN subcategory TEXT NOT NULL DEFAULT ''",
        'description' => "ALTER TABLE products ADD COLUMN description TEXT DEFAULT ''",
        'short_description' => "ALTER TABLE products ADD COLUMN short_description TEXT DEFAULT ''",
        'technical_specs' => "ALTER TABLE products ADD COLUMN technical_specs TEXT DEFAULT ''",
        'brand' => "ALTER TABLE products ADD COLUMN brand TEXT DEFAULT ''",
        'sizes' => "ALTER TABLE products ADD COLUMN sizes TEXT DEFAULT ''",
        'image_url_2' => "ALTER TABLE products ADD COLUMN image_url_2 TEXT DEFAULT ''",
        'image_url_3' => "ALTER TABLE products ADD COLUMN image_url_3 TEXT DEFAULT ''",
    ];

    foreach ($additions as $column => $sql) {
        if (!in_array($column, $columns, true)) {
            $pdo->exec($sql);
        }
    }
};
