<?php
require_once 'config.php';

if (isset($_GET['id'])) {
    $fileId = $_GET['id'];

    // Fetch file data before deletion
    $sql = "SELECT * FROM files WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $fileId]);
    $file = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($file) {
        $filePath = $file['file_path'];
        
        // Delete file from the database
        $sql = "DELETE FROM files WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $fileId]);

        // Check if file was successfully deleted from the database
        if ($stmt->rowCount() > 0) {
            // Delete the file from the server
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            echo json_encode(['status' => 'success', 'message' => 'File deleted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to delete the file']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'File not found']);
    }
}
?>
