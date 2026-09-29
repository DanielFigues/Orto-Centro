<?php

declare(strict_types=1);

require __DIR__ . '/database.php';

const API_TOKEN = 'change-me-to-a-secret-token';

header('Content-Type: application/json');

$allowedOrigin = 'http://localhost:5173';
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === rtrim($allowedOrigin, '/')) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond(int $status, array $payload): never
{
    http_response_code($status);
    if ($status !== 204) {
        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
    exit;
}

function fail(int $status, string $message): never
{
    respond($status, ['error' => $message]);
}

function bearer_or_basic_ok(): bool
{
    $token = getenv('API_TOKEN') ?: API_TOKEN;
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (preg_match('/^Bearer\s+(.+)$/i', $auth, $m) === 1) {
        return hash_equals($token, trim($m[1]));
    }

    if (preg_match('/^Basic\s+(.+)$/i', $auth, $m) === 1) {
        $decoded = base64_decode(trim($m[1]), true);
        if ($decoded === false || strpos($decoded, ':') === false) {
            return false;
        }
        [, $password] = explode(':', $decoded, 2);
        return hash_equals($token, $password);
    }

    if (isset($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])) {
        return hash_equals($token, $_SERVER['PHP_AUTH_PW']);
    }

    return false;
}

function require_auth(): void
{
    if (!bearer_or_basic_ok()) {
        header('WWW-Authenticate: Bearer');
        fail(401, 'Unauthorized');
    }
}

function product_row(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'category' => $row['category'],
        'subcategory' => (string) ($row['subcategory'] ?? ''),
        'image_url' => $row['image_url'],
        'is_active' => (bool) $row['is_active'],
    ];
}

function body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail(400, 'Invalid JSON body');
    }
    return $data;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = '/' . trim((string) $path, '/');
if (str_starts_with($path, '/api')) {
    $path = substr($path, 4);
    if ($path === '') {
        $path = '/';
    }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pdo = db();

if ($path === '/products' && $method === 'GET') {
    $rows = $pdo->query('SELECT * FROM products WHERE is_active = 1 ORDER BY id')->fetchAll();
    respond(200, array_map('product_row', $rows));
}

if ($path === '/products' && $method === 'POST') {
    require_auth();

    $data = body();
    $name = trim((string) ($data['name'] ?? ''));
    $category = trim((string) ($data['category'] ?? ''));
    $subcategory = trim((string) ($data['subcategory'] ?? ''));
    $imageUrl = trim((string) ($data['image_url'] ?? ''));

    if ($name === '') {
        fail(400, 'name is required');
    }
    if ($category === '') {
        fail(400, 'category is required');
    }
    if ($imageUrl !== '' && filter_var($imageUrl, FILTER_VALIDATE_URL) === false) {
        fail(400, 'image_url must be a valid URL');
    }
    $isActive = isset($data['is_active']) ? (bool) $data['is_active'] : true;

    $stmt = $pdo->prepare(
        'INSERT INTO products (name, category, subcategory, image_url, is_active)
         VALUES (:name, :category, :subcategory, :image_url, :is_active)'
    );
    $stmt->execute([
        ':name' => $name,
        ':category' => $category,
        ':subcategory' => $subcategory,
        ':image_url' => $imageUrl,
        ':is_active' => $isActive ? 1 : 0,
    ]);

    $row = $pdo->query('SELECT * FROM products WHERE id = ' . (int) $pdo->lastInsertId())->fetch();
    respond(201, ['product' => product_row($row)]);
}

if (preg_match('#^/products/(\d+)$#', $path, $m) === 1 && $method === 'DELETE') {
    require_auth();

    $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
    $stmt->execute([':id' => (int) $m[1]]);
    if ($stmt->rowCount() === 0) {
        fail(404, 'Product not found');
    }
    respond(204, []);
}

fail(405, 'Method not allowed');