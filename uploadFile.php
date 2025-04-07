<?php
require 'config.php'; // Include DB connection

$successMessage = "";
$errorMessage = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['uploadedFile'])) {
    $file = $_FILES['uploadedFile'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileError = $file['error'];
    $uploadDir = "uploads/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true); // Create directory if it doesn't exist
    }

    $filePath = $uploadDir . basename($fileName);

    if ($fileError === 0) {
        if (move_uploaded_file($fileTmpName, $filePath)) {
            $successMessage .= "File successfully uploaded to folder.\n";

            // Insert file data into the database
            $sql = "INSERT INTO files (file_name, file_path, upload_timestamp) VALUES (:fileName, :filePath, NOW())";
            $stmt = $pdo->prepare($sql);

            try {
                $stmt->execute([
                    ':fileName' => $fileName,
                    ':filePath' => $filePath
                ]);

                if ($stmt->rowCount() > 0) {
                    $successMessage .= "File path saved in the database successfully!";
                } else {
                    $errorMessage .= "Failed to save file in the database.";
                }
            } catch (PDOException $e) {
                $errorMessage .= "Error saving file to the database: " . $e->getMessage();
            }
        } else {
            $errorMessage .= "Failed to upload file!";
        }
    } else {
        $errorMessage .= "Error uploading your file!";
    }
}

// Respond with a success or error message
if ($errorMessage) {
    echo json_encode(["status" => "error", "message" => $errorMessage]);
} else {
    echo json_encode(["status" => "success", "message" => $successMessage]);
}
?>
