// Navbar Links
const createUserBtn = document.getElementById('createUserBtn');
const showUsersBtn = document.getElementById('showUsersBtn');
const uploadFileBtn = document.getElementById('uploadFileBtn');
const showFilesBtn = document.getElementById('showFilesBtn');
const userListSection = document.getElementById('userListSection');
const createUserSection = document.getElementById('createUserSection');
const viewFilesSection = document.getElementById('viewFilesSection');
const uploadFileSection = document.getElementById('uploadFileSection');

// Show Section Helper Function
function showSection(sectionToShow) {
    createUserSection.style.display = 'none';
    userListSection.style.display = 'none';
    uploadFileSection.style.display = 'none';
    viewFilesSection.style.display = 'none';

    sectionToShow.style.display = 'block';
}

// Show Create User Section
createUserBtn.addEventListener('click', () => {
    showSection(createUserSection);
});

// Show User List Section
showUsersBtn.addEventListener('click', async () => {
    showSection(userListSection);

    const users = await fetchUsers();
    displayUsers(users);
});

// Show File Upload Section
uploadFileBtn.addEventListener('click', () => {
    showSection(uploadFileSection);
});

// Show Files Section
showFilesBtn.addEventListener('click', async () => {
    showSection(viewFilesSection);

    const files = await fetchFiles();
    displayFiles(files);
});

// Fetch Users from Database
async function fetchUsers() {
    try {
        const response = await fetch('showUsers.php');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Display Users in Table
function displayUsers(users) {
    const usersTable = document.getElementById('usersTable');
    if (usersTable) {
        let tableContent = users.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>DOB</th>
                        <th>Action</th>  <!-- Added Action column -->
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>${user.dob}</td>
                            <td>
                                <button class="delete-user-btn" data-id="${user.id}">Delete</button> <!-- Added delete button -->
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<p>No users found.</p>';
        usersTable.innerHTML = tableContent;

        // Add delete event listeners
        const deleteButtons = document.querySelectorAll('.delete-user-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.target.getAttribute('data-id');
                deleteUser(userId);
            });
        });
    }
}

async function deleteUser(userId) {
    const response = await fetch(`deleteUser.php?id=${userId}`, {
        method: 'GET'
    });
    const result = await response.json();

    if (result.status === 'success') {
        alert(result.message);
        const users = await fetchUsers();
        displayUsers(users);  // Refresh the user list after deletion
    } else {
        alert(result.message);
    }
}

// Password Validation Function
function validatePassword(password) {
    console.log('Validating Password:', password);  // Debugging line
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{15,}$/;
    return passwordRegex.test(password);
}

// Handle User Form Submission (Create User)
// Handle User Form Submission (Create User)
// Handle User Form Submission (Create User)
const userForm = document.getElementById('userForm');
userForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get the form data
    const formData = new FormData(userForm);
    console.log("Form data:", formData); // Check if the form data is being captured correctly

    // Validate Password
    const password = formData.get('password');
    console.log("Password to validate:", password); // Check if the password is being captured correctly
    if (!validatePassword(password)) {
        showPopup('Password must be at least 15 characters long, include uppercase and lowercase letters, digits, and special characters.');
        return; // Stop the form from submitting
    }

    // Send the form data to the server via fetch
    const response = await fetch('create.php', {
        method: 'POST',
        body: formData
    });

    console.log("Response status:", response.status); // Check if the response status is OK
    const result = await response.json(); // Parse the response as JSON
    console.log("Response result:", result); // Log the result

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
    console.log('Popup message:', message); // Debugging line
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

// File Upload Section
const fileForm = document.getElementById('fileForm');
fileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(fileForm);
    const response = await fetch('uploadFile.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.status === 'success') {
        alert(result.message);
        location.reload();
    } else {
        alert(result.message);
    }
});

// Fetch Files from Database
async function fetchFiles() {
    try {
        const response = await fetch('fetchFiles.php');
        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Display Files in Table
function displayFiles(files) {
    const filesTable = document.getElementById('filesTable');

    if (filesTable) {
        if (files.length > 0) {
            let table = `
                <table>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>File Path</th>
                            <th>Upload Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            files.forEach(file => {
                const uploadTime = new Date(file.upload_timestamp).toLocaleString();
                table += `
                    <tr>
                        <td>${file.file_name}</td>
                        <td><a href="${file.file_path}" target="_blank">${file.file_path}</a></td>
                        <td>${uploadTime}</td>
                        <td>
                            <a href="downloadFile.php?id=${file.id}" target="_blank">Download</a> |
                            <button class="delete-btn" data-id="${file.id}">Delete</button>
                        </td>
                    </tr>
                `;
            });

            table += `</tbody></table>`;
            filesTable.innerHTML = table;

            // Add delete event listeners
            const deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const fileId = e.target.getAttribute('data-id');
                    deleteFile(fileId);
                });
            });
        } else {
            filesTable.innerHTML = '<p>No files found.</p>';
        }
    }
}

// Handle file deletion
async function deleteFile(fileId) {
    const response = await fetch(`deleteFile.php?id=${fileId}`);
    const result = await response.json();

    if (result.status === 'success') {
        alert(result.message);
        const files = await fetchFiles();
        displayFiles(files);
    } else {
        alert(result.message);
    }
}
