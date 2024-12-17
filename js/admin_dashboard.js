
// Function to open the logout modal
function openLogoutModal() {
    document.getElementById('logoutModal').classList.remove('hidden');
}

// Function to close the logout modal
function closeLogoutModal() {
    document.getElementById('logoutModal').classList.add('hidden');
}

// Function to handle logout confirmation (you can customize this as needed)
function confirmLogout() {
    // Perform logout actions here, e.g., redirect to a logout page
    window.location.href = 'index.html';
    alert('Logged out successfully!');
    closeLogoutModal();
}

// Function to fetch the user count from the PHP server using XMLHttpRequest
function fetchUserCount() {
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Set up the GET request to the PHP script
    xhr.open('GET', '/php/fetch_user_count.php', true);

    // Set the response type to JSON
    xhr.responseType = 'json';

    // Define the function that will be called when the request completes
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Check if the request was successful
            if (xhr.response.success) {
                // If successful, update the user count on the page
                document.getElementById('userCount').textContent = xhr.response.count;
            } else {
                console.error('Failed to fetch user count:', xhr.response.message);
            }
        } else {
            // If the HTTP request fails, log the error
            console.error('Request failed. Status:', xhr.status);
        }
    };

    // Define what happens in case of an error (network or request failure)
    xhr.onerror = function () {
        console.error('Request failed due to network error');
    };

    // Send the request
    xhr.send();
}

// Call the function to fetch the user count when the page loads


// This function will fetch the average stock quantity from the PHP server
function fetchAvgStockQuantity() {
    // Send the AJAX request to the PHP script
    fetch('/php/avg_stock_quantity.php')
        .then(response => response.json()) // Expecting JSON response
        .then(data => {
            if (data.success) {
                // If the request was successful, update the average stock quantity on the page
                document.getElementById('avgStockQuantity').textContent = data.avg_stock_quantity;
            } else {
                console.error('Failed to fetch average stock quantity');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = function() {
    fetchAvgStockQuantity();
    fetchUserCount();
};


