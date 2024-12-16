function submitForm(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Show an alert after the form is submitted
    alert("Signup complete!");

    // Redirect the user to the login page after 2 seconds
    setTimeout(function() {
        window.location.href = "user_login.html";
    }, 2000); // 2000 milliseconds = 2 seconds
}

    const firstForm = document.getElementById('first-form');
    const secondForm = document.getElementById('second-form');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const passwordError = document.getElementById('password-error');

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
                // JavaScript code
    const barangayOptions = {
            barangay1: ['Street 1', 'Street 2', 'Street 3'],
            barangay2: ['Street A', 'Street B', 'Street C'],
            // Add more Barangay-Street mappings as needed
            };

    const barangayDropdowns = document.querySelectorAll('#barangay');
    const streetDropdowns = document.querySelectorAll('#street');

    barangayDropdowns.forEach((barangayDropdown, index) => {
      barangayDropdown.addEventListener('change', () => {
        const selectedBarangay = barangayDropdown.value;
        const streetOptions = barangayOptions[selectedBarangay] || [];

        const streetDropdown = streetDropdowns[index];
        streetDropdown.innerHTML = '<option value="">Select a Street</option>';
        streetOptions.forEach((street) => {
          const option = document.createElement('option');
          option.value = street;
          option.textContent = street;
          streetDropdown.appendChild(option);
        });
      });
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
    async function submitForm(event) {
        event.preventDefault();

        errorMessage.style.display = 'none';

        const fname = document.getElementById('first_name').value.trim();
        const lname = document.getElementById('last_name').value.trim();
            const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const barangay = barangaySelects[0].value;
        const street = streetSelects[0].value;

        const username = document.getElementById('username').value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!username || !fname || !lname || !email || !phone || !barangay || !street || !password || !confirmPassword) {
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
        formData.append('fist_name', fname);
        formData.append('last_name', lname);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('barangay', barangay);
        formData.append('street', street);
        formData.append('password', password);

        try {
            const response = await fetch('customer_signup.php', { method: 'POST', body: formData });
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
    }

    // Display error messages
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

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

    // Validate password on the second form
    function validatePassword(event) {
        if (passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault();
            passwordError.classList.remove('hidden');
        }
    }

    confirmPasswordInput.addEventListener('input', () => {
        if (passwordInput.value === confirmPasswordInput.value) {
            passwordError.classList.add('hidden');
        }
    });

    // Initial population of barangays
    populateBarangays();

    // Add form submission handler
    form.addEventListener('submit', submitForm);