<?php
// Include your database connection file
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form data
    $first_name = trim($_POST['first_name']) ?? '';
    $last_name = trim($_POST['last_name']) ?? '';
    $phone = trim($_POST['phone']) ?? '';
    $email = trim($_POST['email']) ?? '';
    $date_of_birth = $_POST['date_of_birth'] ?? '';
    $password = $_POST['password'] ?? '';

    // Validate form fields
    if (!empty($first_name) && !empty($last_name) && !empty($phone) && !empty($email) && !empty($date_of_birth) && !empty($password)) {
        // Hash the password before inserting into DB
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        try {
            // Prepare SQL statement with placeholders
            $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, phone, email, dob, password) 
                                   VALUES (:first_name, :last_name, :phone, :email, :dob, :password)");

            // Bind parameters to prevent SQL injection
            $stmt->bindParam(':first_name', $first_name);
            $stmt->bindParam(':last_name', $last_name);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':dob', $date_of_birth);
            $stmt->bindParam(':password', $hashed_password);

            // Execute the statement and check for success
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "User created successfully"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error: Could not create user"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
    }
}
?>
