<?php

declare(strict_types=1);

/**
 * Conexão SQLite + sistema de migrações automáticas.
 *
 * - Migrações vivem em backend/migrations/ como arquivos numerados (001_nome.php).
 * - Cada arquivo declara: `return function (PDO $pdo): void { ... };`
 * - db() aplica, dentro de UMA transação, todas as migrações pendentes na primeira
 *   conexão e registra cada uma em `schema_migrations` (id, name, applied_at).
 * - Se todas já foram aplicadas, não faz nada (verificação barata).
 * - Uma falha reverte a transação inteira: o banco nunca fica meio migrado.
 * - Migrações devem ser aditivas e idempotentes por si mesmas (PRAGMA table_info
 *   antes de ALTER TABLE), para funcionar em bancos antigos ou já migrados.
 */

function db_path(): string
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir . '/catalog.sqlite';
}

function migrations_dir(): string
{
    return __DIR__ . '/migrations';
}

/**
 * @return array<string, string> Mapa nome de arquivo => caminho absoluto, ordenado.
 */
function discover_migrations(): array
{
    $dir = migrations_dir();
    if (!is_dir($dir)) {
        return [];
    }

    $files = [];
    foreach (scandir($dir) as $entry) {
        if (preg_match('/^\d+_[a-z0-9_]+\.php$/i', $entry) !== 1) {
            continue;
        }
        $files[$entry] = $dir . '/' . $entry;
    }

    ksort($files, SORT_STRING);
    return $files;
}

/**
 * @return array<int, string> Nomes das migrações já aplicadas.
 */
function applied_migrations(PDO $pdo): array
{
    $columns = $pdo->query(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'"
    )->fetchAll(PDO::FETCH_COLUMN);

    if (count($columns) === 0) {
        return [];
    }

    return $pdo->query('SELECT name FROM schema_migrations')->fetchAll(PDO::FETCH_COLUMN);
}

function run_pending_migrations(PDO $pdo): void
{
    $all = discover_migrations();
    if ($all === []) {
        return;
    }

    $applied = applied_migrations($pdo);
    $pending = array_filter(
        $all,
        static fn (string $name): bool => !in_array($name, $applied, true),
        ARRAY_FILTER_USE_KEY,
    );

    if ($pending === []) {
        return;
    }

    $pdo->beginTransaction();
    try {
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS schema_migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                applied_at TEXT NOT NULL DEFAULT (datetime(\'now\'))
            )'
        );

        $record = $pdo->prepare(
            'INSERT INTO schema_migrations (name) VALUES (:name) ON CONFLICT(name) DO NOTHING'
        );

        foreach ($pending as $name => $path) {
            /** @var callable(PDO): void $migration */
            $migration = include $path;
            if (!is_callable($migration)) {
                throw new RuntimeException("Migração inválida: {$name} deve retornar um callable.");
            }
            $migration($pdo);
            $record->execute([':name' => $name]);
        }

        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

/**
 * Abre uma conexão em um caminho específico e aplica as migrações pendentes.
 * Usado por CLIs que aceitam --db; db() continua sendo o atalho do banco padrão.
 */
function db_open(string $path): PDO
{
    $pdo = new PDO('sqlite:' . $path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON');
    run_pending_migrations($pdo);

    return $pdo;
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $pdo = db_open(db_path());
    }

    return $pdo;
}
