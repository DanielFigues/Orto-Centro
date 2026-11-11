<?php

declare(strict_types=1);

/**
 * 003_add_image_slots: adiciona colunas opcionais de imagem (4 e 5).
 * Aditiva e idempotente: não remove, não altera e não apaga dados existentes.
 *
 * SQL exato:
 *   ALTER TABLE products ADD COLUMN image_url_4 TEXT DEFAULT '';
 *   ALTER TABLE products ADD COLUMN image_url_5 TEXT DEFAULT '';
 */
return function (PDO $pdo): void {
    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);

    $additions = [
        'image_url_4' => "ALTER TABLE products ADD COLUMN image_url_4 TEXT DEFAULT ''",
        'image_url_5' => "ALTER TABLE products ADD COLUMN image_url_5 TEXT DEFAULT ''",
    ];

    foreach ($additions as $column => $sql) {
        if (!in_array($column, $columns, true)) {
            $pdo->exec($sql);
        }
    }
};
