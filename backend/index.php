<?php

declare(strict_types=1);

// --- LEITOR DE FICHEIRO .ENV ---
$envPath = __DIR__ . '/../.env'; 
if (!file_exists($envPath)) {
    $envPath = __DIR__ . '/.env'; // Fallback para a pasta backend
}

if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue; // Ignora linhas vazias e comentários
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value, " \t\n\r\0\x0B\"'"); // Remove espaços e aspas
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
        }
    }
}
// -------------------------------

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
    $token = getenv('API_TOKEN') ?: ($_ENV['API_TOKEN'] ?? '');
    if ($token === '' || $token === false) {
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

function parse_price($raw, bool $required = false): ?float
{
    if ($raw === null) {
        return null;
    }

    if (is_string($raw)) {
        $raw = trim($raw);
        if ($raw === '') {
            return null;
        }
        $normalized = str_contains($raw, ',')
            ? str_replace(['.', ','], ['', '.'], $raw)
            : $raw;
        if (!is_numeric($normalized)) {
            fail(400, 'O preço deve ser um número válido maior que zero.');
        }
        $price = (float) $normalized;
    } elseif (is_int($raw) || is_float($raw)) {
        $price = (float) $raw;
    } else {
        fail(400, 'O preço deve ser um número válido maior que zero.');
    }

    if (!is_finite($price)) {
        fail(400, 'O preço deve ser um número válido maior que zero.');
    }
    if ($price <= 0) {
        fail(400, 'O preço deve ser maior que zero.');
    }
    if ($price > 9999999.99) {
        fail(400, 'O preço deve ser menor que 9.999.999,99.');
    }

    return round($price, 2);
}

/**
 * Converte sizes (array, JSON ou texto legado separado por vírgula) em uma
 * lista limpa de opções. Aceita no máximo 20 tamanhos distintos.
 *
 * @return array<int, string>
 */
function decode_sizes(mixed $value): array
{
    $items = [];

    if (is_array($value)) {
        $items = $value;
    } elseif (is_string($value)) {
        $raw = trim($value);
        if ($raw !== '') {
            if (str_starts_with($raw, '[')) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    $items = $decoded;
                }
            } else {
                $items = preg_split('/[,;]/', $raw) ?: [];
            }
        }
    }

    $sizes = [];
    foreach ($items as $item) {
        if (!is_scalar($item)) {
            continue;
        }

        $size = trim((string) $item);
        if ($size === '' || mb_strlen($size, 'UTF-8') > 40) {
            continue;
        }
        if (!in_array($size, $sizes, true)) {
            $sizes[] = $size;
        }
        if (count($sizes) >= 20) {
            break;
        }
    }

    return $sizes;
}

function encode_sizes(mixed $value): string
{
    return json_encode(decode_sizes($value), JSON_UNESCAPED_UNICODE) ?: '[]';
}

/**
 * @return array<int, int>
 */
function decode_tray_ids(mixed $value): array
{
    if (is_string($value)) {
        $value = trim($value);
        $value = $value === '' ? [] : (json_decode($value, true) ?? []);
    }

    if (!is_array($value)) {
        return [];
    }

    $ids = [];
    foreach ($value as $id) {
        $id = (int) $id;
        if ($id > 0 && !in_array($id, $ids, true)) {
            $ids[] = $id;
        }
    }

    return $ids;
}

function product_row(array $row): array
{
    $price = null;
    if (array_key_exists('price', $row) && $row['price'] !== null && $row['price'] !== '') {
        $parsed = (float) $row['price'];
        $price = is_finite($parsed) ? $parsed : null;
    }

    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'category' => $row['category'],
        'subcategory' => (string) ($row['subcategory'] ?? ''),
        'image_url' => $row['image_url'],
        'image_url_2' => (string) ($row['image_url_2'] ?? ''),
        'image_url_3' => (string) ($row['image_url_3'] ?? ''),
        'image_url_4' => (string) ($row['image_url_4'] ?? ''),
        'image_url_5' => (string) ($row['image_url_5'] ?? ''),
        'video_url' => (string) ($row['video_url'] ?? ''),
        'video_url_2' => (string) ($row['video_url_2'] ?? ''),
        'video_url_3' => (string) ($row['video_url_3'] ?? ''),
        'description' => (string) ($row['description'] ?? ''),
        'short_description' => (string) ($row['short_description'] ?? ''),
        'technical_specs' => (string) ($row['technical_specs'] ?? ''),
        'brand' => (string) ($row['brand'] ?? ''),
        'sizes' => decode_sizes($row['sizes'] ?? []),
        'tray_ids' => decode_tray_ids($row['tray_ids'] ?? []),
        'created_at' => (string) ($row['created_at'] ?? ''),
        'updated_at' => (string) ($row['updated_at'] ?? ''),
        'imported_at' => (string) ($row['imported_at'] ?? ''),
        'price' => $price,
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

function process_video_field(?string $value, string $fieldName): string
{
    if ($value === null || trim($value) === '') {
        return '';
    }
    $value = trim($value);

    // O arquivo em si é enviado antes, via POST /upload/video (que devolve a
    // URL /uploads/...); aqui chega apenas a URL final. Base64 em JSON não é
    // aceito para vídeo: inflaria a memória do PHP.
    if (str_starts_with($value, 'http://')
        || str_starts_with($value, 'https://')
        || str_starts_with($value, '/uploads/')
    ) {
        return $value;
    }

    fail(400, "O campo $fieldName deve ser uma URL de vídeo (http, https ou /uploads/).");
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

// Upload de vídeo de produto: corpo bruto (application/octet-stream) com o
// nome do arquivo na query string (?filename=...). Multipart não é usado
// porque o padrão do PHP (upload_max_filesize=2M) descarta silenciosamente
// arquivos maiores; base64 em JSON inflaria a memória. O stream abaixo grava
// em blocos de 512 KB, sem carregar o arquivo inteiro na memória.
if ($path === '/upload/video' && $method === 'POST') {
    require_auth();

    $filename = trim((string) ($_GET['filename'] ?? ''));
    if ($filename === '') {
        fail(400, 'Informe o nome do arquivo de vídeo.');
    }

    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $allowedExtensions = ['mp4', 'webm', 'mov', 'm4v'];
    if (!in_array($ext, $allowedExtensions, true)) {
        fail(400, 'Formato de vídeo não suportado. Use MP4, WebM ou MOV.');
    }

    $maxBytes = 100 * 1024 * 1024; // 100 MB por vídeo
    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > $maxBytes) {
        fail(413, 'O vídeo excede o limite de 100 MB.');
    }

    $uploadsDir = __DIR__ . '/../public/uploads';
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0775, true);
    }

    $safeName = 'vid_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $target = $uploadsDir . '/' . $safeName;

    $source = fopen('php://input', 'rb');
    $output = fopen($target, 'wb');
    if ($source === false || $output === false) {
        if (is_resource($source)) fclose($source);
        if (is_resource($output)) fclose($output);
        @unlink($target);
        fail(500, 'Não foi possível salvar o vídeo.');
    }

    $written = 0;
    try {
        while (!feof($source)) {
            $chunk = fread($source, 512 * 1024);
            if ($chunk === false) {
                throw new RuntimeException('read');
            }
            if ($chunk === '') {
                continue;
            }
            $written += strlen($chunk);
            if ($written > $maxBytes) {
                fclose($source);
                fclose($output);
                @unlink($target);
                fail(413, 'O vídeo excede o limite de 100 MB.');
            }
            if (fwrite($output, $chunk) === false) {
                throw new RuntimeException('write');
            }
        }
    } catch (Throwable $e) {
        fclose($source);
        fclose($output);
        @unlink($target);
        fail(500, 'Não foi possível salvar o vídeo.');
    }

    fclose($source);
    fclose($output);

    if ($written === 0) {
        @unlink($target);
        fail(400, 'Nenhum vídeo foi enviado.');
    }

    respond(201, ['url' => '/uploads/' . $safeName]);
}

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
    $imageUrl4 = process_image_field(isset($data['image_url_4']) ? (string) $data['image_url_4'] : '', 'image_url_4');
    $imageUrl5 = process_image_field(isset($data['image_url_5']) ? (string) $data['image_url_5'] : '', 'image_url_5');
    $videoUrl = process_video_field(isset($data['video_url']) ? (string) $data['video_url'] : '', 'video_url');
    $videoUrl2 = process_video_field(isset($data['video_url_2']) ? (string) $data['video_url_2'] : '', 'video_url_2');
    $videoUrl3 = process_video_field(isset($data['video_url_3']) ? (string) $data['video_url_3'] : '', 'video_url_3');
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
    $sizes = encode_sizes($data['sizes'] ?? []);
    $price = array_key_exists('price', $data) ? parse_price($data['price']) : null;

    if ($name === '') {
        fail(400, 'O nome é obrigatório.');
    }
    if ($category === '') {
        fail(400, 'A categoria é obrigatória.');
    }
    $isActive = isset($data['is_active']) ? (bool) $data['is_active'] : true;

    $stmt = $pdo->prepare(
        'INSERT INTO products (name, category, subcategory, image_url, image_url_2, image_url_3, image_url_4, image_url_5, video_url, video_url_2, video_url_3, description, short_description, technical_specs, brand, sizes, price, is_active, created_at, updated_at)
         VALUES (:name, :category, :subcategory, :image_url, :image_url_2, :image_url_3, :image_url_4, :image_url_5, :video_url, :video_url_2, :video_url_3, :description, :short_description, :technical_specs, :brand, :sizes, :price, :is_active, :created_at, :updated_at)'
    );
    $stmt->execute([
        ':name' => $name,
        ':category' => $category,
        ':subcategory' => $subcategory,
        ':image_url' => $imageUrl,
        ':image_url_2' => $imageUrl2,
        ':image_url_3' => $imageUrl3,
        ':image_url_4' => $imageUrl4,
        ':image_url_5' => $imageUrl5,
        ':video_url' => $videoUrl,
        ':video_url_2' => $videoUrl2,
        ':video_url_3' => $videoUrl3,
        ':description' => $description,
        ':short_description' => $shortDescription,
        ':technical_specs' => $technicalSpecs,
        ':brand' => $brand,
        ':sizes' => $sizes,
        ':price' => $price,
        ':is_active' => $isActive ? 1 : 0,
        ':created_at' => date('c'),
        ':updated_at' => date('c'),
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
            $existing['image_url_4'] ?? '',
            $existing['image_url_5'] ?? '',
            $existing['video_url'] ?? '',
            $existing['video_url_2'] ?? '',
            $existing['video_url_3'] ?? '',
        ]);

        $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
        $stmt->execute([':id' => $id]);
        respond(204, []);
    } catch (Throwable $e) {
        fail(500, $e->getMessage() ?: 'Internal server error');
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
        $imageUrl4 = array_key_exists('image_url_4', $data) ? process_image_field((string) $data['image_url_4'], 'image_url_4') : (string) ($existing['image_url_4'] ?? '');
        $imageUrl5 = array_key_exists('image_url_5', $data) ? process_image_field((string) $data['image_url_5'], 'image_url_5') : (string) ($existing['image_url_5'] ?? '');
        $videoUrl = array_key_exists('video_url', $data) ? process_video_field((string) $data['video_url'], 'video_url') : (string) ($existing['video_url'] ?? '');
        $videoUrl2 = array_key_exists('video_url_2', $data) ? process_video_field((string) $data['video_url_2'], 'video_url_2') : (string) ($existing['video_url_2'] ?? '');
        $videoUrl3 = array_key_exists('video_url_3', $data) ? process_video_field((string) $data['video_url_3'], 'video_url_3') : (string) ($existing['video_url_3'] ?? '');
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
        $sizes = array_key_exists('sizes', $data) ? encode_sizes($data['sizes']) : encode_sizes($existing['sizes'] ?? []);
        $price = array_key_exists('price', $data) ? parse_price($data['price']) : (array_key_exists('price', $existing) ? parse_price($existing['price']) : null);
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
            (string) ($existing['image_url_4'] ?? ''),
            (string) ($existing['image_url_5'] ?? ''),
            (string) ($existing['video_url'] ?? ''),
            (string) ($existing['video_url_2'] ?? ''),
            (string) ($existing['video_url_3'] ?? ''),
        ];

        $update = $pdo->prepare(
            'UPDATE products SET name = :name, category = :category, subcategory = :subcategory,
             image_url = :image_url, image_url_2 = :image_url_2, image_url_3 = :image_url_3, image_url_4 = :image_url_4, image_url_5 = :image_url_5,
             video_url = :video_url, video_url_2 = :video_url_2, video_url_3 = :video_url_3,
             description = :description, short_description = :short_description,
             technical_specs = :technical_specs, brand = :brand, sizes = :sizes, price = :price, is_active = :is_active,
             updated_at = :updated_at
             WHERE id = :id'
        );
        $update->execute([
            ':name' => $name,
            ':category' => $category,
            ':subcategory' => $subcategory,
            ':image_url' => $imageUrl,
            ':image_url_2' => $imageUrl2,
            ':image_url_3' => $imageUrl3,
            ':image_url_4' => $imageUrl4,
            ':image_url_5' => $imageUrl5,
            ':video_url' => $videoUrl,
            ':video_url_2' => $videoUrl2,
            ':video_url_3' => $videoUrl3,
            ':description' => $description,
            ':short_description' => $shortDescription,
            ':technical_specs' => $technicalSpecs,
            ':brand' => $brand,
            ':sizes' => $sizes,
            ':price' => $price,
            ':is_active' => $isActive ? 1 : 0,
            ':updated_at' => date('c'),
            ':id' => $id,
        ]);

        // Remove do disco os arquivos locais que foram substituídos ou removidos.
        $currentUrls = [$imageUrl, $imageUrl2, $imageUrl3, $imageUrl4, $imageUrl5, $videoUrl, $videoUrl2, $videoUrl3];
        foreach ($previousUrls as $oldUrl) {
            $stillInUse = in_array($oldUrl, $currentUrls, true);
            if ($oldUrl !== '' && !$stillInUse) {
                delete_uploaded_file($oldUrl);
            }
        }

        $row = $pdo->query('SELECT * FROM products WHERE id = ' . $id)->fetch();
        respond(200, ['product' => product_row($row)]);
    } catch (Throwable $e) {
        fail(500, $e->getMessage() ?: 'Internal server error');
    }
}

fail(405, 'Método não permitido.');
