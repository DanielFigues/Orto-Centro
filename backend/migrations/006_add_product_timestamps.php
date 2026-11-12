<?php

declare(strict_types=1);

/**
 * 006_add_product_timestamps: datas de criação, atualização e importação.
 * Aditiva e idempotente: não remove, não altera e não apaga dados existentes.
 *
 * SQL exato:
 *   ALTER TABLE products ADD COLUMN created_at TEXT NULL;
 *   ALTER TABLE products ADD COLUMN updated_at TEXT NULL;
 *   ALTER TABLE products ADD COLUMN imported_at TEXT NULL;
 *   UPDATE products SET created_at = COALESCE(created_at, <agora>);
 *   UPDATE products SET updated_at = COALESCE(updated_at, <agora>);
 *   UPDATE products SET imported_at = COALESCE(imported_at, <agora>)
 *       WHERE tray_id IS NOT NULL;
 */
return function (PDO $pdo): void {
    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);

    foreach (['created_at', 'updated_at', 'imported_at'] as $column) {
        if (!in_array($column, $columns, true)) {
            $pdo->exec("ALTER TABLE products ADD COLUMN {$column} TEXT NULL");
        }
    }

    $now = date('c');

    $pdo->prepare('UPDATE products SET created_at = COALESCE(created_at, :now)')
        ->execute([':now' => $now]);
    $pdo->prepare('UPDATE products SET updated_at = COALESCE(updated_at, :now)')
        ->execute([':now' => $now]);
    $pdo->prepare('UPDATE products SET imported_at = COALESCE(imported_at, :now) WHERE tray_id IS NOT NULL')
        ->execute([':now' => $now]);
};
