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
  window.location.href = 'index.html';
  alert('Logged out successfully!');
  closeLogoutModal();
}

// Function to fetch the customer ID from the clicked element
function fetchCustomerId(customerElement) {
  // Get the customer ID from the data-id attribute of the clicked icon
  console.log('Clicked on delete icon. Customer ID:', customerElement.getAttribute('data-id'));
  return customerElement.getAttribute('data-id');
}


// Function to delete the customer
async function deleteCustomer(customerId) {
  try {
    console.log('Deleting customer with ID:', customerId);

    // Send a DELETE request to the backend PHP file
    const response = await fetch('/php/delete.php', {
      method: 'POST', // Use POST to send data
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
      body: JSON.stringify({ id: customerId }), // Send the customer ID in the request body
    });

    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error('Failed to delete customer');
    }

    // Parse the response JSON
    const result = await response.json();

    // Handle success or failure
    if (result.success) {
      alert(result.message); // Show success message
      location.reload(); // Reload the page to reflect changes
    } else {
      alert(result.message); // Show failure message
    }

  } catch (error) {
    // Log any errors and alert the user
    console.error('Error deleting customer:', error);
    alert('Error deleting customer');
  }
}

// Event listener for deleting a customer
const deleteIcons = document.querySelectorAll('.fa-trash');
deleteIcons.forEach(icon => {
  icon.addEventListener('click', function () {
    const customerId = fetchCustomerId(this); // Fetch the customer ID
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(customerId); // Call deleteCustomer function to delete the customer
    }
  });
});

// Fetch data (replace this with your actual data-fetching code)
const dataContainer = document.getElementById('y'); // The container for your data rows

fetch('/php/customer_overview.php')
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      data.forEach(item => {
        const dataRow = document.createElement('div');
        dataRow.classList.add('w-full', 'h-9', 'md:h-12', 'bg-[#A8E6CF]', 'rounded-[20px]', 'px-3', 'flex', 'justify-center', 'items-center', 'mb-3');

        const content = `
          <div class="flex flex-row gap-3 text-[#004d40] font-baloo2 font-bold px-2 md:text-[18px] w-full h-fit">
            <p class="w-1/5 text-center flex justify-center items-center">${item.id}</p>
            <p class="w-1/5 text-center flex justify-center items-center">${item.username}</p>
            <p class="w-1/5 text-center flex justify-center items-center">${item.name}</p>
            <p class="w-1/5 text-center flex justify-center items-center">${item.address}</p>
            <p class="w-1/5 text-center flex justify-center items-center">${item.phone}</p>
            <i class="fa-solid fa-trash flex items-center justify-center cursor-pointer" data-id="${item.id}"></i>
          </div>
        `;

        dataRow.innerHTML = content;
        dataContainer.appendChild(dataRow);
      });

      // After rendering, attach the event listeners
      const deleteIcons = document.querySelectorAll('.fa-trash');
      console.log('Delete icons:', deleteIcons); // Debugging line to check if the icons are selected
      deleteIcons.forEach(icon => {
        icon.addEventListener('click', function () {
          console.log('Delete icon clicked'); // Debugging line to see if the event is triggered
          const customerId = fetchCustomerId(this); // Fetch the customer ID
          if (confirm('Are you sure you want to delete this customer?')) {
            deleteCustomer(customerId); // Call deleteCustomer function to delete the customer
          }
        });
      });
    } else {
      dataContainer.innerHTML = '<p>No items available in the stock.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });


 // Fetch data (replace this with your actual data-fetching code)