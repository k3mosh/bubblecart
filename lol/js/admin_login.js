document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('admin_authenticate.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                // Save login state to localStorage
                localStorage.setItem('admin_logged_in', 'true');
                window.location.href = 'admin_page.html';
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorMessage.style.display = 'block';
        }
    });
});
