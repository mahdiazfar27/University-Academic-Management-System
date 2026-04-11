<?php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking Settings Table ===\n";
$settings = DB::table('settings')->get();

echo "Records found: " . count($settings) . "\n";
foreach ($settings as $setting) {
    echo "Key: {$setting->key}\n";
    echo "Value: " . substr($setting->value ?: 'NULL', 0, 100) . "\n";
    echo "---\n";
}

echo "\n=== Testing Setting Model ===\n";
$model = \App\Models\Setting::all();
echo "Settings from model: " . count($model) . " records\n";
foreach ($model as $s) {
    echo "Key: {$s->key}, Value: " . substr($s->value ?: 'NULL', 0, 100) . "\n";
}
?>
