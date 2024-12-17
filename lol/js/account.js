document.addEventListener('DOMContentLoaded', () => {
    const accountInfo = document.getElementById('account-info');
    const accountForm = document.getElementById('account-form');
    const editAccountButton = document.getElementById('edit-account');
    const saveAccountButton = document.getElementById('save-account');
    const cancelEditButton = document.getElementById('cancel-edit');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogoutButton = document.getElementById('confirm-logout');
    const cancelLogoutButton = document.getElementById('cancel-logout');

    // Fetch and display user data
    async function fetchUserData() {
        try {
            const response = await fetch('customer_accounts.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ action: 'fetch' }),
            });

            const result = await response.json();

            if (result.success) {
                console.log('Fetched user data:', result); // Debug log
                document.getElementById('greeting').textContent = `Hello, ${result.username}!`;
                document.getElementById('display-username').textContent = result.username;
                document.getElementById('display-email').textContent = result.email;
                document.getElementById('display-phone').textContent = result.phone;
                document.getElementById('display-address').textContent = `${result.barangay}, ${result.street}`;
                populateEditForm(result);
            } else {
                console.error('Failed to fetch user data:', result.message);
                alert(result.message || 'Failed to load user data.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('An error occurred while fetching user data.');
        }
    }

    function populateEditForm(data) {
        document.getElementById('username').value = data.username;
        document.getElementById('phone').value = data.phone;
        document.getElementById('barangay').value = data.barangay;
        document.getElementById('street').value = data.street;
    }

    // Toggle Edit Mode
    editAccountButton.addEventListener('click', () => {
        accountInfo.style.display = 'none';
        accountForm.style.display = 'block';
        editAccountButton.style.display = 'none'; // Hide the "Edit Account" button
    });

    cancelEditButton.addEventListener('click', () => {
        accountInfo.style.display = 'block';
        accountForm.style.display = 'none';
        editAccountButton.style.display = 'block'; // Show the "Edit Account" button again
        clearPasswordFields(); // Clear password fields on cancel
    });

    // Save Updated Account Info
    saveAccountButton.addEventListener('click', async () => {
        const phone = document.getElementById('phone').value.trim();
        const currentPassword = document.getElementById('current-password').value.trim();
        const newPassword = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        

        // Validate phone number format (Philippine format: starts with 09 and 11 digits)
        const phoneRegex = /^09\d{9}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid Philippine phone number starting with "09" and having 11 digits.');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        try {
            const formData = new URLSearchParams(new FormData(accountForm));
            formData.append('action', 'update');
            formData.append('current-password', currentPassword);
            formData.append('new-password', newPassword);
            formData.append('confirm-password', confirmPassword);

            const response = await fetch('customer_accounts.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                accountInfo.style.display = 'block';
                accountForm.style.display = 'none';
                editAccountButton.style.display = 'block'; // Show the "Edit Account" button again
                fetchUserData(); // Refresh displayed data
            } else {
                alert(result.message || 'Failed to update account.');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            alert('An error occurred while updating your account.');
        }
        clearPasswordFields();
    });

    // Logout with Confirmation Modal
    document.getElementById('logout').addEventListener('click', () => {
        logoutModal.classList.remove('hidden'); // Show the logout modal
    });

    confirmLogoutButton.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = 'index.html'; // Redirect to homepage
    });

    cancelLogoutButton.addEventListener('click', () => {
        logoutModal.classList.add('hidden'); // Hide the modal if user cancels
    });

    // Clear password fields function
    function clearPasswordFields() {
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    }

    // Fetch initial user data on page load
    fetchUserData();

    // Clear password fields when navigating away from the page (before unload)
    window.addEventListener('beforeunload', clearPasswordFields);
});
