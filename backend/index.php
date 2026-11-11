<?php

declare(strict_types=1);

require __DIR__ . '/database.php';

header('Content-Type: application/json');

$allowedOrigin = 'http://localhost:5173';
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === rtrim($allowedOrigin, '/')) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
    $token = getenv('API_TOKEN');
    if ($token === false || trim($token) === '') {
        return false;
    }

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
        'image_url_2' => (string) ($row['image_url_2'] ?? ''),
        'image_url_3' => (string) ($row['image_url_3'] ?? ''),
        'description' => (string) ($row['description'] ?? ''),
        'short_description' => (string) ($row['short_description'] ?? ''),
        'technical_specs' => (string) ($row['technical_specs'] ?? ''),
        'brand' => (string) ($row['brand'] ?? ''),
        'sizes' => (string) ($row['sizes'] ?? ''),
        'is_active' => (bool) $row['is_active'],
    ];
}

function generate_filename(string $ext): string
{
    return 'img_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
}

function save_base64_image(string $base64, string $fieldName): string
{
    if (strpos($base64, 'data:image/') === 0) {
        $parts = explode(',', $base64, 2);
        if (count($parts) !== 2) {
            fail(400, "Invalid $fieldName data");
        }
        $header = $parts[0];
        if (preg_match('#data:image/(.+?);base64#i', $header, $m) !== 1) {
            preg_match('#data:image/(.+?)#i', $header, $m);
        }
        $ext = isset($m[1]) ? strtolower($m[1]) : 'png';
        $data = base64_decode($parts[1], true);
    } else {
        $data = base64_decode($base64, true);
        $ext = 'png';
    }

    if ($data === false) {
        fail(400, "Invalid $fieldName data");
    }

    $uploadsDir = __DIR__ . '/../public/uploads';
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0775, true);
    }

    $filename = generate_filename($ext === 'jpeg' ? 'jpg' : $ext);
    $filepath = $uploadsDir . '/' . $filename;
    if (file_put_contents($filepath, $data) === false) {
        fail(500, "Failed to save $fieldName");
    }

    return '/uploads/' . $filename;
}

function process_image_field(?string $value, string $fieldName): string
{
    if ($value === null || trim($value) === '') {
        return '';
    }
    $value = trim($value);

    // Já é uma URL de imagem (http/https) ou um arquivo previamente enviado
    // (/uploads/...): mantenha o valor exatamente como chegou, sem tentar
    // decodificá-lo como Base64.
    if (str_starts_with($value, 'http://')
        || str_starts_with($value, 'https://')
        || str_starts_with($value, '/uploads/')
    ) {
        return $value;
    }

    if (strpos($value, 'data:image/') === 0 || (!filter_var($value, FILTER_VALIDATE_URL) && preg_match('#^[A-Za-z0-9+/=]+$#', $value) && strlen($value) > 100)) {
        return save_base64_image($value, $fieldName);
    }

    if (filter_var($value, FILTER_VALIDATE_URL) !== false) {
        return $value;
    }

    return $value;
}

function delete_uploaded_file(string $imageUrl): void
{
    // Apenas URLs de uploads locais (/uploads/<arquivo>) possuem um arquivo
    // físico em disco. URLs http(s) e outros valores não são tocados.
    if (!preg_match('#^/uploads/([^/]+)$#', $imageUrl, $m)) {
        return;
    }

    $filename = basename($m[1]);
    $filepath = __DIR__ . '/../public/uploads/' . $filename;

    if (is_file($filepath)) {
        unlink($filepath);
    }
}

function delete_uploaded_files(array $imageUrls): void
{
    foreach ($imageUrls as $url) {
        delete_uploaded_file((string) $url);
    }
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

if ($path === '/products/all' && $method === 'GET') {
    require_auth();

    $rows = $pdo->query('SELECT * FROM products ORDER BY id')->fetchAll();
    respond(200, array_map('product_row', $rows));
}

if ($path === '/products' && $method === 'POST') {
    require_auth();

    try {
    $data = body();
    $name = trim((string) ($data['name'] ?? ''));
    $category = trim((string) ($data['category'] ?? ''));
    $subcategory = trim((string) ($data['subcategory'] ?? ''));
    $imageUrl = process_image_field(isset($data['image_url']) ? (string) $data['image_url'] : '', 'image_url');
    $imageUrl2 = process_image_field(isset($data['image_url_2']) ? (string) $data['image_url_2'] : '', 'image_url_2');
    $imageUrl3 = process_image_field(isset($data['image_url_3']) ? (string) $data['image_url_3'] : '', 'image_url_3');
    $description = trim((string) ($data['description'] ?? ''));
    $shortDescription = trim((string) ($data['short_description'] ?? ''));
    $technicalSpecs = trim((string) ($data['technical_specs'] ?? ''));
    if ($technicalSpecs !== '') {
        $decodedSpecs = json_decode($technicalSpecs, true);
        if (!is_array($decodedSpecs)) {
            fail(400, 'Technical specs deve ser um array JSON válido.');
        }
    }
    $brand = trim((string) ($data['brand'] ?? ''));
    $sizes = trim((string) ($data['sizes'] ?? ''));

    if ($name === '') {
        fail(400, 'O nome é obrigatório.');
    }
    if ($category === '') {
        fail(400, 'A categoria é obrigatória.');
    }
    $isActive = isset($data['is_active']) ? (bool) $data['is_active'] : true;

    $stmt = $pdo->prepare(
        'INSERT INTO products (name, category, subcategory, image_url, image_url_2, image_url_3, description, short_description, technical_specs, brand, sizes, is_active)
         VALUES (:name, :category, :subcategory, :image_url, :image_url_2, :image_url_3, :description, :short_description, :technical_specs, :brand, :sizes, :is_active)'
    );
    $stmt->execute([
        ':name' => $name,
        ':category' => $category,
        ':subcategory' => $subcategory,
        ':image_url' => $imageUrl,
        ':image_url_2' => $imageUrl2,
        ':image_url_3' => $imageUrl3,
        ':description' => $description,
        ':short_description' => $shortDescription,
        ':technical_specs' => $technicalSpecs,
        ':brand' => $brand,
        ':sizes' => $sizes,
        ':is_active' => $isActive ? 1 : 0,
    ]);

    $row = $pdo->query('SELECT * FROM products WHERE id = ' . (int) $pdo->lastInsertId())->fetch();
    respond(201, ['product' => product_row($row)]);
    } catch (Throwable $e) {
        fail(500, $e->getMessage() ?: 'Internal server error');
    }
}

if (preg_match('#^/products/(\d+)$#', $path, $m) === 1 && $method === 'DELETE') {
    require_auth();

    try {
        $id = (int) $m[1];

        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $existing = $stmt->fetch();
        if (!$existing) {
            fail(404, 'Produto não encontrado.');
        }

        delete_uploaded_files([
            $existing['image_url'],
            $existing['image_url_2'],
            $existing['image_url_3'],
        ]);

        $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
        $stmt->execute([':id' => $id]);
        respond(204, []);
    } catch (Throwable $e) {
        fail(500, 'Internal server error');
    }
}

if (preg_match('#^/products/(\d+)$#', $path, $m) === 1 && $method === 'PUT') {
    require_auth();

    try {
        $data = body();
        $id = (int) $m[1];
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $existing = $stmt->fetch();
        if (!$existing) {
            fail(404, 'Produto não encontrado.');
        }

        $name = array_key_exists('name', $data) ? trim((string) ($data['name'] ?? '')) : (string) $existing['name'];
        $category = array_key_exists('category', $data) ? trim((string) ($data['category'] ?? '')) : (string) $existing['category'];
        $subcategory = array_key_exists('subcategory', $data) ? trim((string) ($data['subcategory'] ?? '')) : (string) ($existing['subcategory'] ?? '');
        $imageUrl = array_key_exists('image_url', $data) ? process_image_field((string) $data['image_url'], 'image_url') : (string) ($existing['image_url'] ?? '');
        $imageUrl2 = array_key_exists('image_url_2', $data) ? process_image_field((string) $data['image_url_2'], 'image_url_2') : (string) ($existing['image_url_2'] ?? '');
        $imageUrl3 = array_key_exists('image_url_3', $data) ? process_image_field((string) $data['image_url_3'], 'image_url_3') : (string) ($existing['image_url_3'] ?? '');
        $description = array_key_exists('description', $data) ? trim((string) ($data['description'] ?? '')) : (string) ($existing['description'] ?? '');
        $shortDescription = array_key_exists('short_description', $data) ? trim((string) ($data['short_description'] ?? '')) : (string) ($existing['short_description'] ?? '');
        $technicalSpecs = array_key_exists('technical_specs', $data) ? trim((string) ($data['technical_specs'] ?? '')) : (string) ($existing['technical_specs'] ?? '');
        if ($technicalSpecs !== '') {
            $decodedSpecs = json_decode($technicalSpecs, true);
            if (!is_array($decodedSpecs)) {
                fail(400, 'Technical specs deve ser um array JSON válido.');
            }
        }
        $brand = array_key_exists('brand', $data) ? trim((string) ($data['brand'] ?? '')) : (string) ($existing['brand'] ?? '');
        $sizes = array_key_exists('sizes', $data) ? trim((string) ($data['sizes'] ?? '')) : (string) ($existing['sizes'] ?? '');
        $isActive = array_key_exists('is_active', $data) ? (bool) $data['is_active'] : (bool) $existing['is_active'];

        if ($name === '') {
            fail(400, 'O nome é obrigatório.');
        }
        if ($category === '') {
            fail(400, 'A categoria é obrigatória.');
        }

        $previousUrls = [
            (string) ($existing['image_url'] ?? ''),
            (string) ($existing['image_url_2'] ?? ''),
            (string) ($existing['image_url_3'] ?? ''),
        ];

        $update = $pdo->prepare(
            'UPDATE products SET name = :name, category = :category, subcategory = :subcategory,
             image_url = :image_url, image_url_2 = :image_url_2, image_url_3 = :image_url_3,
             description = :description, short_description = :short_description,
             technical_specs = :technical_specs, brand = :brand, sizes = :sizes, is_active = :is_active
             WHERE id = :id'
        );
        $update->execute([
            ':name' => $name,
            ':category' => $category,
            ':subcategory' => $subcategory,
            ':image_url' => $imageUrl,
            ':image_url_2' => $imageUrl2,
            ':image_url_3' => $imageUrl3,
            ':description' => $description,
            ':short_description' => $shortDescription,
            ':technical_specs' => $technicalSpecs,
            ':brand' => $brand,
            ':sizes' => $sizes,
            ':is_active' => $isActive ? 1 : 0,
            ':id' => $id,
        ]);

        // Remove do disco os arquivos locais que foram substituídos ou removidos.
        $currentUrls = [$imageUrl, $imageUrl2, $imageUrl3];
        foreach ($previousUrls as $oldUrl) {
            $stillInUse = in_array($oldUrl, $currentUrls, true);
            if ($oldUrl !== '' && !$stillInUse) {
                delete_uploaded_file($oldUrl);
            }
        }

        $row = $pdo->query('SELECT * FROM products WHERE id = ' . $id)->fetch();
        respond(200, ['product' => product_row($row)]);
    } catch (Throwable $e) {
        fail(500, 'Internal server error');
    }
}

fail(405, 'Método não permitido.');
