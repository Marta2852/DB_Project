// Navbar Links
const createUserBtn = document.getElementById('createUserBtn');
const showUsersBtn = document.getElementById('showUsersBtn');
const userListSection = document.getElementById('userListSection');
const createUserSection = document.getElementById('createUserSection');

// Show Create User Section
createUserBtn.addEventListener('click', () => {
    createUserSection.style.display = 'block';
    userListSection.style.display = 'none';
});

// Show User List Section
showUsersBtn.addEventListener('click', async () => {
    createUserSection.style.display = 'none';
    userListSection.style.display = 'block';

    const users = await fetchUsers();
    displayUsers(users);
});

// Fetch Users from Database
async function fetchUsers() {
    try {
        const response = await fetch('showUsers.php');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json(); // Parse the JSON response
        return data;
    } catch (error) {
        console.error(error); // Log error if fetching fails
        return []; // Return an empty array if there’s an error
    }
}

// Display Users in Table
function displayUsers(users) {
    const usersTable = document.getElementById('usersTable');
    
    if (usersTable) {
        if (users.length > 0) {
            let table = `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>DOB</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // Loop through each user and generate a row in the table
            users.forEach(user => {
                table += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.first_name}</td>
                        <td>${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${user.dob}</td>
                    </tr>
                `;
            });

            table += `</tbody></table>`;
            usersTable.innerHTML = table; // Insert the table into the page
        } else {
            usersTable.innerHTML = '<p>No users found.</p>'; // Display message if no users found
        }
    }
}

// Password Validation Function
function validatePassword(password) {
    // Password must be at least 15 characters long, contain uppercase and lowercase letters, digits, and special characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/;
    return passwordRegex.test(password);
}

// Handle User Form Submission (Create User)
const userForm = document.getElementById('userForm');
userForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get the form data
    const formData = new FormData(userForm);

    // Validate Password
    const password = formData.get('password');
    if (!validatePassword(password)) {
        showPopup('Password must be at least 15 characters long, include uppercase and lowercase letters, digits, and special characters.');
        return; // Stop the form from submitting
    }

    // Send the form data to the server via fetch
    const response = await fetch('create.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json(); // Parse the response as JSON
    showPopup(result.message); // Show a popup with the response message

    // Refresh the page after successful user creation
    if (result.status === 'success') {
        setTimeout(() => {
            location.reload(); // Reload the page
        }, 1000); // Wait for 1 second before reloading
    }
});

// Show Popup with Message
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.querySelector('#popup .message');
    popupMessage.textContent = message; // Set the message in the popup
    popup.style.display = 'block'; // Show the popup
}

// Close Popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // Hide the popup
}

// Optional: Close the popup if the user clicks outside of it
window.addEventListener('click', (e) => {
    const popup = document.getElementById('popup');
    if (e.target === popup) {
        closePopup();
    }
});
