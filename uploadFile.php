<?php

ini_set('display_errors', 1);
ini_set('display_Startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

$successMessage = "";

if (isset($_FILES['uploadedFile'])){
    $file = $_FILES['uploadedFile'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileError = $file['error'];

    $uploadDir = "uploads/";

    if (!is_dir($uploadDir)){
        mkdir($uploadDir, 0777, true);
    }

    $filePath = $uploadDir . basename($fileName);

    if ($fileError === 0){
        if (move_uploaded_file($fileTmpName, $filePath)){
            $successMessage .= " File Successfully uploaded to folder. \n ";

            $sql = "INSERT INTO upload_paths (file_name, file_path) VALUES (:fileName, :filePath)";
            $stmt = $conn->prepare($sql);

            try {
                $stmt->execute([
                    ':fileName' => $fileName,
                    'filePath' => $filePath
                ]);

                if ($stmt->rowCount() > 0){
                    $successMessage .= " File path saved in the database successfully! ";
                } else {
                    $successMessage .= "  Failed to save file in the database. ";
                }
            } catch (PDOException $e) {
                $successMessage .= " Error saving file to the database: " .$e->getMessage() . " ";
            }

        } else {
            $successMessage .= " Failed to upload file! ";
        }
    } else {
        $successMessage .= " Error uploading your file! ";
    }
}

$conn = null;

header("Location: index.html?successMessage=" . urlencode($successMessage));
exit();