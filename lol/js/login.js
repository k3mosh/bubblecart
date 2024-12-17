document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get input values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate inputs
        if (!username || !password) {
            displayError('Username and password are required.');
            return;
        }

        try {
            // Send login request
            const response = await fetch('customer_authenticate.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, password }),
            });

            const result = await response.json();

            if (result.success) {
                // Save user data to sessionStorage with fallback defaults
                sessionStorage.setItem('username', result.username);
                sessionStorage.setItem('phone', result.phone);
                sessionStorage.setItem('email', result.email || '');
                sessionStorage.setItem('address', result.address);
                
                // Provide feedback before redirecting
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to homepage
                }, 1000); // Wait 1 second before redirecting
            } else {
                displayError(result.message);
            }
        } catch (error) {
            displayError('An error occurred. Please try again later.');
        }
    });

    // Function to display error messages
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
