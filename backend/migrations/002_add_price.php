<?php

declare(strict_types=1);

/**
 * 002_add_price: adiciona coluna opcional de preço aos produtos.
 * Aditiva e idempotente: não remove, não altera e não apaga dados existentes.
 *
 * SQL exato (compatível com SQLite/MySQL):
 *   ALTER TABLE products ADD COLUMN price DECIMAL(10,2) NULL DEFAULT NULL;
 */
return function (PDO $pdo): void {
    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);

    if (!in_array('price', $columns, true)) {
        $pdo->exec('ALTER TABLE products ADD COLUMN price DECIMAL(10,2) NULL DEFAULT NULL');
    }
};
