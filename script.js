// Ensure the popup is hidden on page load
window.onload = function() {
    document.getElementById("popup").style.display = "none";
};

// Function to handle form submission via AJAX
document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Get form data

    // Send AJAX request to create.php
    fetch("create.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            showPopup(data.message); // Show success message
        } else {
            showPopup(data.message); // Show error message
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showPopup("An error occurred while submitting the form.");
    });
});

// Function to show the popup
function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.querySelector(".message").textContent = message;
    popup.style.display = "block"; // Show the popup
}

// Function to close the popup
function closePopup() {
    document.getElementById("popup").style.display = "none"; // Hide the popup
}
