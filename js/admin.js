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

const username = sessionStorage.getItem('username');
    
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const accountTab = document.getElementById('account-tab');

// Show/hide based on login state
if (username) {
    loginLink.classList.add('hidden');
    signupLink.classList.add('hidden');
    accountTab.classList.remove('hidden');
} else {
    loginLink.classList.remove('hidden');
    signupLink.classList.remove('hidden');
    accountTab.classList.add('hidden');
}

const burgerMenu = document.getElementById('menu');
const loginLinkBurger = burgerMenu.querySelector('.login-link');
const signupLinkBurger = burgerMenu.querySelector('.signup-link');
const accountTabBurger = burgerMenu.querySelector('.account-tab');

if (username) {
    loginLinkBurger.classList.add('hidden');
    signupLinkBurger.classList.add('hidden');
    accountTabBurger.classList.remove('hidden');
} else {
    loginLinkBurger.classList.remove('hidden');
    signupLinkBurger.classList.remove('hidden');
    accountTabBurger.classList.add('hidden');
}

// Handle form submission via AJAX
// Handle form submission via AJAX
document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent form from submitting normally

    // Get form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create a new FormData object
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // Make AJAX request to PHP script
    fetch("/php/authenticate.php", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Display success message
            alert(data.message); // This will show the "Successful login, redirecting to dashboard" message

            // Save username to sessionStorage
            sessionStorage.setItem('username', data.username);
            
            // Redirect to admin dashboard or another page
            window.location.href = "admin_dashboard.html"; // Replace with your dashboard URL
        } else {
            // Display error message
            alert(data.message); // Or display it in your UI
        }
    })
    .catch(error => {
        console.error("Error fetching admins data:", error);
    });
});

