function menu() {
    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");

    // Toggle the menu visibility
    menu.classList.toggle("opacity-0");
    menu.classList.toggle("opacity-100");
    menu.classList.toggle("translate-x-full");
    menu.classList.toggle("translate-x-0");

    // Animate the burger to X
    burger.classList.toggle("open");
}

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('.login-link');
    const signupLink = document.querySelector('.signup-link');
    const accountLink = document.querySelector('.account-link');

    // Check if the user is logged in by checking sessionStorage for user_id
    const userId = sessionStorage.getItem('user_id');

    if (userId) {
        // If the user is logged in, hide "Log In" and "Sign Up", show "Account"
        loginLink.classList.add('hidden');
        signupLink.classList.add('hidden');
        accountLink.classList.remove('hidden');

        // Fetch user data based on user ID
        fetchUserData(userId);
    } else {
        // If the user is not logged in, show "Log In" and "Sign Up", hide "Account"
        loginLink.classList.remove('hidden');
        signupLink.classList.remove('hidden');
        accountLink.classList.add('hidden');
    }

    // Handle form submission for login
    const form = document.querySelector('form');  // Select the first form on the page
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
    
        // Validate inputs
        if (!username || !password) {
            displayError('Username and password are required.');
            return;
        }
    
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
    
        try {
            const response = await fetch('/php/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });
    
            const result = await response.json();
    
            if (result.success) {
                // Store user data in sessionStorage for future use
                sessionStorage.setItem('user_id', result.user_id);  // Store user ID
                sessionStorage.setItem('username', result.username);  // Optionally, store the username
    
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to dashboard
                }, 1000);
            } else {
                displayError(result.message); // Show error message if login fails
            }
        } catch (error) {
            displayError('An error occurred. Please try again later.');
        }
    });
    

    // Function to display error messages
    function displayError(message) {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        } else {
            console.error('Error message element not found!');
        }
    }
    

    // Function to fetch and display user data
    function fetchUserData(userId) {
        const userInfoContainer = document.getElementById('user-info');

        fetch('/php/getUserData.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ user_id: userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userInfoContainer.innerHTML = `
                    <p>Name: ${data.name}</p>
                    <p>Email: ${data.email}</p>
                    <h3>Orders:</h3>
                    <ul>
                        ${data.orders.map(order => `
                            <li>Order #${order.id} - ${order.status}</li>
                        `).join('')}
                    </ul>
                `;
            } else {
                userInfoContainer.innerHTML = '<p>Error: Could not load user data.</p>';
            }
        })
        .catch(error => {
            userInfoContainer.innerHTML = '<p>Error fetching data.</p>';
        });
    }
});

