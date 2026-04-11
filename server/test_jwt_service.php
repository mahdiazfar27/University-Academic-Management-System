<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';

try {
    $service = $app->make('App\Services\JwtService');
    echo "✓ JwtService instantiated successfully\n";
    echo "  Service class: " . get_class($service) . "\n";
} catch (Exception $e) {
    echo "✗ Error instantiating JwtService:\n";
    echo "  " . $e->getMessage() . "\n";
    echo "  " . $e->getFile() . ":" . $e->getLine() . "\n";
}
