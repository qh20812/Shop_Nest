<?php

$root = dirname(__DIR__);

$catalog = require $root.'/database/seeders/data/demo_catalog.php';
$shops = require $root.'/database/seeders/data/demo_shops.php';

$productDir = $root.'/public/images/products';
$shopDir = $root.'/public/images/shops';

foreach ([$productDir, $shopDir] as $dir) {
    if (! is_dir($dir) && ! mkdir($dir, 0775, true) && ! is_dir($dir)) {
        fwrite(STDERR, "Không thể tạo thư mục: {$dir}\n");
        exit(1);
    }
}

/**
 * @return bool true nếu tải thành công hoặc file đã tồn tại
 */
function download(string $url, string $destination): bool
{
    if (is_file($destination) && filesize($destination) > 10_000) {
        return true;
    }

    $handle = curl_init($url);
    $file = fopen($destination, 'wb');

    curl_setopt_array($handle, [
        CURLOPT_FILE => $file,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 3,
        CURLOPT_TIMEOUT => 40,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_USERAGENT => 'ShopNest demo image downloader',
    ]);

    $ok = curl_exec($handle);
    $status = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    $error = curl_error($handle);

    fclose($file);
    curl_close($handle);

    if (! $ok || $status >= 400) {
        @unlink($destination);
        fwrite(STDERR, "FAILED [{$status}] {$url}".($error ? " ({$error})" : '')."\n");

        return false;
    }

    return true;
}

$failed = 0;

foreach ($catalog as $product) {
    $destination = $productDir.'/'.$product['slug'].'.jpg';

    if (! download($product['image'], $destination)) {
        $failed++;
    }
}

foreach ($shops as $shop) {
    if (empty($shop['banner_source'])) {
        continue;
    }

    $destination = $shopDir.'/'.$shop['slug'].'.jpg';

    if (! download($shop['banner_source'], $destination)) {
        $failed++;
    }
}

echo 'Downloaded '.count($catalog).' product images and '.count($shops)." shop banners.\n";

if ($failed > 0) {
    fwrite(STDERR, "{$failed} file(s) failed. Replace URLs or copy fallback images.\n");
    exit(1);
}
