<?php

declare(strict_types=1);

/**
 * 007_add_tray_ids: todos os códigos Tray absorvidos por um produto.
 * Um produto fundido mantém o tray_id do membro primário e guarda aqui a
 * lista completa (JSON) dos códigos que representava.
 * Aditiva e idempotente: não remove, não altera e não apaga dados existentes.
 *
 * SQL exato:
 *   ALTER TABLE products ADD COLUMN tray_ids TEXT NOT NULL DEFAULT '';
 *   -- preenche tray_ids = '["<tray_id>"]' para linhas importadas;
 *   -- linhas sem tray_id ficam com '[]'.
 */
return function (PDO $pdo): void {
    $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);

    if (!in_array('tray_ids', $columns, true)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN tray_ids TEXT NOT NULL DEFAULT ''");
    }

    $rows = $pdo->query('SELECT id, tray_id, tray_ids FROM products')->fetchAll(PDO::FETCH_ASSOC);
    $update = $pdo->prepare('UPDATE products SET tray_ids = :tray_ids WHERE id = :id');

    foreach ($rows as $row) {
        $current = trim((string) ($row['tray_ids'] ?? ''));
        if ($current !== '' && str_starts_with($current, '[')) {
            continue;
        }

        $ids = [];
        if ($row['tray_id'] !== null && $row['tray_id'] !== '') {
            $ids[] = (int) $row['tray_id'];
        }

        $update->execute([
            ':tray_ids' => json_encode($ids, JSON_UNESCAPED_UNICODE),
            ':id' => (int) $row['id'],
        ]);
    }
};
