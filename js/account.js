function populateUserProfile() {
  const userId = sessionStorage.getItem('user_id'); // Get user_id from sessionStorage

  if (!userId) {
      console.error('User not logged in. No user ID found in sessionStorage.');
      window.location.href = 'login.html'; // Redirect to login page if not logged in
      return;
  }

  // Send user_id to the PHP endpoint
  fetch('php/getUserData.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }) // Send user_id in the request body
  })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              console.error('Error fetching user data:', data.error);
              alert('Error fetching user data.');
              return;
          }

          // Populate the user's full name
          document.getElementById('user-name').innerText = data.full_name || 'N/A';

          // Populate the user's username
          document.getElementById('user-username').innerHTML = `<i class="fa-solid fa-user pr-4"></i> ${data.username || 'N/A'}`;

          // Populate the user's email
          document.getElementById('user-email').innerHTML = `<i class="fa-solid fa-envelope pr-4"></i> ${data.email || 'N/A'}`;

          // Populate the user's phone
          document.getElementById('user-phone').innerHTML = `<i class="fa-solid fa-phone pr-4"></i> ${data.phone || 'N/A'}`;

          // Populate the user's address
          document.getElementById('user-address').innerHTML = `<i class="fa-solid fa-location-dot pr-4"></i> ${data.address || 'N/A'}`;
      })
      .catch(error => console.error('Error:', error));
}



// Call the function to populate the user profile when the page loads
window.onload = populateUserProfile;



const profile = document.getElementById('prof');
                const secondForm = document.getElementById('edit-form');
                const nextBtn = document.getElementById('edit-btn');
                const backBtn = document.getElementById('cancel-btn');

                nextBtn.addEventListener('click', () => {
                profile.classList.add('hidden');
                secondForm.classList.remove('hidden');
                });

backBtn.addEventListener('click', () => {
  profile.classList.remove('hidden');
  secondForm.classList.add('hidden');
  profile;
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

function openLogoutModal() {
    document.getElementById('logoutModal').classList.remove('hidden');
}

// Function to close the logout modal
function closeLogoutModal() {
    document.getElementById('logoutModal').classList.add('hidden');
}

// Function to handle logout confirmation (you can customize this as needed)
function confirmLogout() {
    sessionStorage.clear();
    // Perform logout actions here, e.g., redirect to a logout page
    window.location.href = 'index.html';
    alert('Logged out successfully!');
    closeLogoutModal();
}
 
fetch('/php/fetch_user.php', {
  method: 'POST',  // Use POST method to send data
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({ user_id: sessionStorage.getItem('user_id') })  // Pass user_id from sessionStorage
})
  .then(response => {
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      return response.json();  // Parse JSON response
  })
  .then(data => {
      if (data.error) {
          console.error("Error:", data.error);
      } else {
          // Populate form fields with fetched data
          document.getElementById("username").value = data.username || '';
          document.getElementById("phone").value = data.phone || '';
          document.getElementById("barangay").value = data.barangay || '';
          document.getElementById("street").value = data.street || '';
      }
  })
  .catch(error => console.error("Fetch Error:", error));

  
  // Function to handle the form submission and update the user's data
// Function to handle the form submission and update the user's data
function updateUserData(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the updated user data from the form
  const updatedData = {
      user_id: sessionStorage.getItem('user_id'),  // Fetch user_id from sessionStorage
      username: document.getElementById('username').value,
      phone: document.getElementById('phone').value,
      barangay: document.getElementById('barangay').value,
      street: document.getElementById('street').value
  };

  // Log the updated data (now inside the correct scope)
  console.log(updatedData);

  // Send the updated data to the server using a POST request
  fetch('/php/update_user.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)  // Convert the data to JSON
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      return response.json();  // Parse the response JSON
  })
  .then(data => {
      if (data.error) {
          console.error("Error:", data.error);
      } else {
          // Handle success (you can show a success message or do other things)
          alert('User data updated successfully!');
          window.location.href = 'account.html';
      }
  })
  .catch(error => console.error("Fetch Error:", error));
}

// Attach the updateUserData function to the form submit event
document.getElementById('edit-form').addEventListener('submit', updateUserData);
