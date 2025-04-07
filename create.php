<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form data
    $first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);
    $phone = trim($_POST['phone']);
    $email = trim($_POST['email']);
    $date_of_birth = $_POST['date_of_birth'];
    $password = $_POST['password'];

    // Log input data to check if it's received properly
    error_log("First Name: " . $first_name);
    error_log("Last Name: " . $last_name);
    error_log("Email: " . $email);
    error_log("Phone: " . $phone);
    error_log("Date of Birth: " . $date_of_birth);
    error_log("Password: " . $password);

    // Backend validations
    if (!preg_match("/^[A-Za-zāēīōūčģļņšžāčēīōū]+$/", $first_name) || !preg_match("/^[A-Za-zāēīōūčģļņšžāčēīōū]+$/", $last_name)) {
        echo json_encode(["status" => "error", "message" => "First name and last name can only contain letters"]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
        exit;
    }

    // Check if email is unique
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "Email is already taken"]);
        exit;
    }

    if (!preg_match("/^[0-9]{8}$/", $phone)) {
        echo json_encode(["status" => "error", "message" => "Phone number must be exactly 8 digits"]);
        exit;
    }

    if (new DateTime($date_of_birth) > new DateTime()) {
        echo json_encode(["status" => "error", "message" => "Date of birth cannot be a future date"]);
        exit;
    }

    // Backend password validation
    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/', $password)) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 15 characters long, include uppercase and lowercase letters, digits, and special characters.']);
        exit();
    }

    // Hash the password before inserting into DB
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    error_log("Hashed Password: " . $hashed_password); // Log hashed password for verification

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
        error_log("Error: " . $e->getMessage()); // Log any errors
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
