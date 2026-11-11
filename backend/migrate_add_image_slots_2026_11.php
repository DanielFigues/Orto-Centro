<?php

declare(strict_types=1);

require __DIR__ . '/database.php';

/**
 * Migração aditiva e idempotente: adiciona colunas opcionais de imagem (4 e 5).
 * Não remove, não altera e não apaga dados existentes.
 *
 * SQL exato:
 *   ALTER TABLE products ADD COLUMN image_url_4 TEXT DEFAULT '';
 *   ALTER TABLE products ADD COLUMN image_url_5 TEXT DEFAULT '';
 */
$pdo = db();

$columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);

$targets = [
    'image_url_4' => "ALTER TABLE products ADD COLUMN image_url_4 TEXT DEFAULT ''",
    'image_url_5' => "ALTER TABLE products ADD COLUMN image_url_5 TEXT DEFAULT ''",
];

foreach ($targets as $name => $sql) {
    if (in_array($name, $columns, true)) {
        echo "Coluna {$name} já existe em products. Nenhuma alteração necessária.\n";
        echo "SQL: {$sql}\n";
        continue;
    }

    try {
        $pdo->exec($sql);
        echo "Coluna {$name} adicionada com sucesso.\n";
        echo "SQL executado: {$sql}\n";
    } catch (Throwable $e) {
        $fresh = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);
        if (in_array($name, $fresh, true)) {
            echo "Coluna {$name} já existe em products. Nenhuma alteração necessária.\n";
            echo "SQL: {$sql}\n";
            continue;
        }
        fwrite(STDERR, "Falha na migração de {$name}: " . $e->getMessage() . "\n");
        fwrite(STDERR, "SQL: {$sql}\n");
        exit(1);
    }
}
