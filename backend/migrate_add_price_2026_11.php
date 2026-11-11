<?php

declare(strict_types=1);

require __DIR__ . '/database.php';

/**
 * Migração aditiva e idempotente: adiciona coluna opcional de preço aos produtos.
 * Não remove, não altera e não apaga dados existentes.
 *
 * SQL exato (compatível com SQLite/MySQL):
 *   ALTER TABLE products ADD COLUMN price DECIMAL(10,2) NULL DEFAULT NULL;
 */
$pdo = db();
$driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

function has_price_column(PDO $pdo): bool
{
    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);
    return in_array('price', $columns, true);
}

if (has_price_column($pdo)) {
    echo "Coluna price já existe em products. Nenhuma alteração necessária.\n";
    echo "SQL: ALTER TABLE products ADD COLUMN price DECIMAL(10,2) NULL DEFAULT NULL;\n";
    exit(0);
}

$sql = 'ALTER TABLE products ADD COLUMN price DECIMAL(10,2) NULL DEFAULT NULL';

try {
    $pdo->exec($sql);
    echo "Coluna price adicionada com sucesso.\n";
    echo "SQL executado: {$sql}\n";
} catch (Throwable $e) {
    if (has_price_column($pdo)) {
        echo "Coluna price já existe em products. Nenhuma alteração necessária.\n";
        echo "SQL: {$sql}\n";
        exit(0);
    }

    fwrite(STDERR, 'Falha na migração de preço: ' . $e->getMessage() . "\n");
    fwrite(STDERR, "SQL: {$sql}\n");
    exit(1);
}
