<?php

// bootstrap/curl_config.php

// Disable SSL verification for development (Windows)
if (getenv('APP_ENV') === 'local') {
    // Set default stream context to disable SSL verification
    stream_context_set_default([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ]);
}