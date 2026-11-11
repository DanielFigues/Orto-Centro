<?php

declare(strict_types=1);

/**
 * 004_add_video_slots: adiciona colunas opcionais de vídeo (1 a 3).
 * Aditiva e idempotente: não remove, não altera e não apaga dados existentes.
 *
 * SQL exato:
 *   ALTER TABLE products ADD COLUMN video_url TEXT DEFAULT '';
 *   ALTER TABLE products ADD COLUMN video_url_2 TEXT DEFAULT '';
 *   ALTER TABLE products ADD COLUMN video_url_3 TEXT DEFAULT '';
 */
return function (PDO $pdo): void {
    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);

    $additions = [
        'video_url' => "ALTER TABLE products ADD COLUMN video_url TEXT DEFAULT ''",
        'video_url_2' => "ALTER TABLE products ADD COLUMN video_url_2 TEXT DEFAULT ''",
        'video_url_3' => "ALTER TABLE products ADD COLUMN video_url_3 TEXT DEFAULT ''",
    ];

    foreach ($additions as $column => $sql) {
        if (!in_array($column, $columns, true)) {
            $pdo->exec($sql);
        }
    }
};
