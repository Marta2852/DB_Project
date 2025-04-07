<?php
require_once 'config.php'; // Include DB connection


try {
    $stmt = $pdo->query("SELECT id, first_name, last_name, email, phone, dob FROM users"); 
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>