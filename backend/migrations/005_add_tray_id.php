<?php

declare(strict_types=1);

/**
 * 005_add_tray_id: identificador do produto na Tray, usado para tornar a
 * importação em massa idempotente (o mesmo produto não é duplicado).
 * Aditiva e idempotente: não remove, não altera e não apaga dados existentes.
 *
 * SQL exato:
 *   ALTER TABLE products ADD COLUMN tray_id INTEGER NULL;
 *   CREATE UNIQUE INDEX IF NOT EXISTS idx_products_tray_id
 *       ON products(tray_id) WHERE tray_id IS NOT NULL;
 */
return function (PDO $pdo): void {
    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);

    if (!in_array('tray_id', $columns, true)) {
        $pdo->exec('ALTER TABLE products ADD COLUMN tray_id INTEGER NULL');
    }

    $pdo->exec(
        'CREATE UNIQUE INDEX IF NOT EXISTS idx_products_tray_id
         ON products(tray_id) WHERE tray_id IS NOT NULL'
    );
};
