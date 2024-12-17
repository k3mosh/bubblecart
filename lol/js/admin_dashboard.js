document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');

    // Check if admin is logged in
    if (!localStorage.getItem('admin_logged_in')) {
        window.location.href = 'admin_login.html';
    }

    // Function to set active tab and corresponding section
    function setActiveTab(tabId) {
        tabs.forEach(tab => tab.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
            const sectionId = tabId.split('-')[0] + '-content';
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }
    }
    

    // Preserve active tab on page refresh using sessionStorage
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab) {
        setActiveTab(savedTab);
    } else {
        setActiveTab('dashboard-tab');
    }

    // Set up click listeners for all tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = tab.id;
            setActiveTab(tabId);
            sessionStorage.setItem('activeTab', tabId);
        });
    });

    // Logout Modal Functionality
    const logoutButton = document.getElementById('logout');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogoutButton = document.getElementById('confirm-logout');
    const cancelLogoutButton = document.getElementById('cancel-logout');

    // Show the logout confirmation modal
    logoutButton.addEventListener('click', () => {
        logoutModal.classList.remove('hidden');
    });

    // Handle logout confirmation
    confirmLogoutButton.addEventListener('click', () => {
        // Clear admin login status from localStorage
        localStorage.removeItem('admin_logged_in');
        // Clear session storage
        sessionStorage.clear();
        // Redirect to login page
        window.location.href = 'index.html';
    });

    // Handle logout cancellation
    cancelLogoutButton.addEventListener('click', () => {
        logoutModal.classList.add('hidden');
    });
});

window.onload = function() {
    fetch('manage_stock_list.php')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('item-select');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
};

