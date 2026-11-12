<?php

declare(strict_types=1);

/**
 * 008_sizes_json: converte a coluna sizes de texto separado por vírgula para
 * um array JSON (ex.: '["P","M","G"]'), preservando 'Único'.
 * A coluna continua TEXT no SQLite; muda apenas o formato do conteúdo.
 * Idempotente: linhas que já contêm um array JSON válido não são tocadas.
 *
 * SQL exato:
 *   UPDATE products SET sizes = '<array JSON>' WHERE id = <id>;
 */
return function (PDO $pdo): void {
    $rows = $pdo->query('SELECT id, sizes FROM products')->fetchAll(PDO::FETCH_ASSOC);
    $update = $pdo->prepare('UPDATE products SET sizes = :sizes WHERE id = :id');

    $aliases = [
        'ÚNICO' => 'Único',
        'UNICO' => 'Único',
        'XGG' => 'XG',
    ];

    foreach ($rows as $row) {
        $raw = trim((string) ($row['sizes'] ?? ''));

        if ($raw !== '' && str_starts_with($raw, '[')) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                continue;
            }
        }

        $sizes = [];
        if ($raw !== '') {
            foreach (preg_split('/[,;]/', $raw) ?: [] as $part) {
                $part = trim($part);
                if ($part === '') {
                    continue;
                }

                $key = mb_strtoupper($part, 'UTF-8');
                $part = $aliases[$key] ?? $part;

                if (!in_array($part, $sizes, true)) {
                    $sizes[] = $part;
                }
            }
        }

        $update->execute([
            ':sizes' => json_encode($sizes, JSON_UNESCAPED_UNICODE),
            ':id' => (int) $row['id'],
        ]);
    }
};
