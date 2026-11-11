<?php

declare(strict_types=1);

require __DIR__ . '/database.php';

/**
 * Migrações agora rodam automaticamente em db() (primeira conexão).
 * Este script é mantido apenas por compatibilidade: lista o estado atual.
 */
$pdo = db();

$rows = $pdo->query('SELECT name, applied_at FROM schema_migrations ORDER BY id')->fetchAll();
foreach ($rows as $row) {
    echo "aplicada: {$row['name']} ({$row['applied_at']})\n";
}

if (count($rows) === 0) {
    echo "Nenhuma migração registrada.\n";
}
