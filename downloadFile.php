<?php
require_once 'config.php';  // Ensure this path is correct

if (isset($_GET['id'])) {
    $fileId = $_GET['id'];

    try {
        // Prepare the SQL statement
        $stmt = $pdo->prepare("SELECT * FROM files WHERE id = :id");
        $stmt->bindParam(':id', $fileId, PDO::PARAM_INT);
        $stmt->execute();

        // Fetch the file record
        $file = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($file) {
            // Get the file path and name
            $filePath = $file['file_path'];
            $fileName = $file['file_name'];

            // Check if the file exists
            if (file_exists($filePath)) {
                // Set headers to prompt file download
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' . basename($fileName) . '"');
                header('Content-Length: ' . filesize($filePath));
                readfile($filePath);  // Output the file contents
                exit();
            } else {
                echo "File not found.";
            }
        } else {
            echo "File not found in the database.";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "No file ID provided.";
}
?>
