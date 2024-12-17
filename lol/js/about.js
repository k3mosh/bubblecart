document.addEventListener('DOMContentLoaded', () => {
    // Burger Menu Logic
    const burgerMenu = document.getElementById('burger-menu');
    const navigation = document.getElementById('navigation');

    // Toggle navigation menu
    burgerMenu.addEventListener('click', () => {
        navigation.classList.toggle('show');
    });

    // Close menu if user clicks outside of it
    document.addEventListener('click', (event) => {
        if (!burgerMenu.contains(event.target) && !navigation.contains(event.target)) {
            navigation.classList.remove('show');
        }
    });

    // Header Navigation Logic
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const accountTab = document.getElementById('account-tab');
    const adminIcon = document.getElementById('admin-icon');
    const username = sessionStorage.getItem('username');

    // Update UI based on login status
    function updateNavState() {
        if (username) {
            // If logged in, show Account and Admin Icon, hide Login and Signup
            loginLink.style.display = 'none';
            signupLink.style.display = 'none';
            accountTab.style.display = 'block';
            adminIcon.style.display = 'block';
        } else {
            // If not logged in, show Login and Signup, hide Account and Admin Icon
            loginLink.style.display = 'block';
            signupLink.style.display = 'block';
            accountTab.style.display = 'none';

        }
    }

    updateNavState(); // Call the function to set the initial state

    document.getElementById('logout-button')?.addEventListener('click', () => {
        sessionStorage.removeItem('username');
        updateNavState();
    });
});
