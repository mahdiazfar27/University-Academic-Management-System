<?php
// Create database using PHP MySQLi
$host = '127.0.0.1';
$user = 'root';
$password = '';
$dbname = 'iums_db';

try {
    // Connect to MySQL without database
    $mysqli = new mysqli($host, $user, $password);
    
    if ($mysqli->connect_error) {
        echo "❌ Connection failed: " . $mysqli->connect_error . "\n";
        echo "Make sure MySQL is running!\n";
        exit(1);
    }
    
    // Create database
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    
    if ($mysqli->query($sql) === TRUE) {
        echo "✓ Database '{$dbname}' created successfully\n";
    } else {
        echo "❌ Error creating database: " . $mysqli->error . "\n";
        exit(1);
    }
    
    $mysqli->close();
    echo "✓ Connection closed\n";
    exit(0);
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Make sure MySQL is running and accessible at {$host}\n";
    exit(1);
}
?>
