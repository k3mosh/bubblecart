document.addEventListener('DOMContentLoaded', () => {
    const barangaySelect = document.getElementById('barangay');
    const streetSelect = document.getElementById('street');
    const form = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');

    const barangayToStreets = {
        "Barangay 1": ["Mabini Street", "Rizal Street", "Del Pilar Street"],
        "Barangay 2": ["Quezon Street", "San Jose Street", "Bonifacio Avenue"],
        "Barangay 3": ["San Juan Street", "Lopez Jaena Street", "Kalayaan Avenue"],
        "Barangay 4": ["Burgos Street", "Magallanes Street", "Taft Avenue"]
    };

    function populateBarangays() {
        if (barangaySelect.children.length === 1) {
            Object.keys(barangayToStreets).forEach(barangay => {
                const option = document.createElement('option');
                option.value = barangay;
                option.textContent = barangay;
                barangaySelect.appendChild(option);
            });
        }
    }

    barangaySelect.addEventListener('change', () => {
        const selectedBarangay = barangaySelect.value;
        streetSelect.selectedIndex = 0;
        const defaultStreetOption = streetSelect.firstElementChild;
        streetSelect.innerHTML = '';
        streetSelect.appendChild(defaultStreetOption);

        if (selectedBarangay && barangayToStreets[selectedBarangay]) {
            barangayToStreets[selectedBarangay].forEach(street => {
                const option = document.createElement('option');
                option.value = street;
                option.textContent = street;
                streetSelect.appendChild(option);
            });
        }
    });

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorMessage.style.display = 'none';

    const fname = document.getElementById('first_name').value.trim();
    const lname = document.getElementById('last_name').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const barangay = barangaySelect.value;
    const street = streetSelect.value;
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (!username || !email || !phone || !barangay || !street || !password || !confirmPassword) {
        displayError('All fields are required.');
        return;
    }

    if (password !== confirmPassword) {
        displayError('Passwords do not match.');
        return;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("Please enter a valid phone number starting with '09' and 11 digits.");
        return false;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailRegex)) {
        displayError('Please enter a valid email address.');
        return;
    }

    const formData = new FormData();
    formData.append('first_name', fname);
    formData.append('last_name', lname);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('barangay', barangay);
    formData.append('street', street);
    formData.append('password', password);

    try {
        const response = await fetch('/php/customer_signup.php', { method: 'POST', body: formData });
        const result = await response.json();

        if (result.success) {
            alert('Account created successfully! Redirecting to login page...');
            window.location.href = 'user_login.html';
        } else {
            displayError(result.message || 'An error occurred during signup. Please try again.');
        }
    } catch (error) {
        displayError('An unexpected error occurred. Please try again later.');
    }
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
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
} 
const firstForm = document.getElementById('first-form');
const secondForm = document.getElementById('second-form');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');

// Move to the next form
nextBtn.addEventListener('click', () => {
    firstForm.classList.add('hidden');
    secondForm.classList.remove('hidden');
});

// Go back to the first form
backBtn.addEventListener('click', () => {
    secondForm.classList.add('hidden');
    firstForm.classList.remove('hidden');
});


populateBarangays();
});
