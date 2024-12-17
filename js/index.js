document.addEventListener('DOMContentLoaded', () => {
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



    // Carousel functionality
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

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
                item.classList.add('scale-[1.3]', 'z-50', 'opacity-100');
            } else if (index === (currentIndex + 1) % items.length) {
                item.classList.add('translate-x-[150px]', 'z-10', 'opacity-80');
            } else if (index === (currentIndex - 1 + items.length) % items.length) {
                item.classList.add('translate-x-[-150px]', 'z-10', 'opacity-80');
            }
        });
    }

    function rotateCarousel() {
        if (items.length === 0) return;
        currentIndex = (currentIndex + 1) % items.length;
        initializeCarousel();
    }

    initializeCarousel();
    setInterval(rotateCarousel, 3000);

    // Menu toggle functionality
    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");

    burger.addEventListener('click', () => {
        menu.classList.toggle("opacity-0");
        menu.classList.toggle("opacity-100");
        menu.classList.toggle("translate-x-full");
        menu.classList.toggle("translate-x-0");
        burger.classList.toggle("open");
    });
});
