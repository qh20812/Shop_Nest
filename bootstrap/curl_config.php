<?php

// bootstrap/curl_config.php

// Disable SSL verification for development (Windows)
if (env('APP_ENV') === 'local') {
    curl_setopt($GLOBALS['HTTP_DEFAULT_OPTIONS'] ?? [], CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($GLOBALS['HTTP_DEFAULT_OPTIONS'] ?? [], CURLOPT_SSL_VERIFYHOST, false);
}