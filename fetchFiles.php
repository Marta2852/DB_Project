<?php
require 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM files");
    $files = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($files);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
