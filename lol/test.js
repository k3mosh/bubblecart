document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.carousel-item'); // Select all carousel items
    let currentIndex = 0; // Set the initial index to the first item

    function initializeCarousel() {
        items.forEach((item, index) => {
            item.classList.remove(
                'scale-[1.3]',
                'z-50',
                'opacity-100',
                'translate-x-[-150px]',
                'translate-x-[150px]',
                'z-10',
                'opacity-80'
            );

            if (index === currentIndex) {
                item.classList.add('scale-[1.3]', 'z-50', 'opacity-100'); // Center item
            } else if (index === (currentIndex + 1) % items.length) {
                item.classList.add('translate-x-[150px]', 'z-10', 'opacity-80'); // Right item
            } else if (index === (currentIndex - 1 + items.length) % items.length) {
                item.classList.add('translate-x-[-150px]', 'z-10', 'opacity-80'); // Left item
            }
        });
    }

    function rotateCarousel() {
        if (items.length === 0) return;
        currentIndex = (currentIndex + 1) % items.length; // Move to the next item
        initializeCarousel();
    }

    // Initialize the carousel on page load
    initializeCarousel();

    // Set the carousel to rotate every 3 seconds
    setInterval(rotateCarousel, 3000);
});
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
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const accountTab = document.getElementById('account-tab');
    const adminIcon = document.getElementById('admin-icon');
    
    // Check if the user is logged in (this is just an example, use actual authentication method)
    const isLoggedIn = false;  // Replace with actual authentication check (e.g., check session or cookie)

    if (isLoggedIn) {
        // Show account and hide login/signup links
        accountTab.style.display = 'block';
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        adminIcon.style.display = 'block'; // Show the admin icon for logged-in users
    } else {
        // Show login/signup links
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
        accountTab.style.display = 'none';
        adminIcon.style.display = 'none'; // Hide the admin icon for non-logged-in users
    }
});
