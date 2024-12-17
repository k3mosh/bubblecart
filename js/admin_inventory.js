// Function to toggle the dropdown menu
function toggleDropdown() {
    const dropdown = document.getElementById("dropdownMenu");
    dropdown.classList.toggle("hidden");
}

// Function to handle option selection from the dropdown
function filterOption(option) {
    alert(`Selected: ${option}`);
    toggleDropdown();
}

// Function to open the logout modal
function openLogoutModal() {
    document.getElementById('logoutModal').classList.remove('hidden');
}

// Function to close the logout modal
function closeLogoutModal() {
    document.getElementById('logoutModal').classList.add('hidden');
}

// Function to handle logout confirmation
function confirmLogout() {
    // Perform logout actions here (e.g., redirect to a logout page)
    window.location.href = 'index.html';
    alert('Logged out successfully!');
    closeLogoutModal();
}

// Fetch data for inventory overview
fetch('/php/inventory_overview.php') // Replace with the correct PHP file path
.then(response => response.json())
.then(data => {
  const dataContainer = document.getElementById('y'); // The container for your data rows
  
  // Check if data is returned and create rows accordingly
  if (data.length > 0) {
    data.forEach(item => {
      const dataRow = document.createElement('div');
      dataRow.classList.add('w-full', 'h-9', 'md:h-12', 'bg-[#A8E6CF]', 'rounded-[20px]', 'px-3', 'flex', 'justify-center', 'items-center', 'mb-3');
      
      const content = `
        <div class="flex flex-row gap-3 text-[#2B8A6D] font-baloo2 font-bold px-2 md:text-[22px] w-full">
          <p class="w-1/2 text-center">${item.name}</p>
          <p class="w-1/2 text-center">${item.stock_quantity}</p>
        </div>
      `;
      
      // Add the generated content to the row and append to the container
      dataRow.innerHTML = content;
      dataContainer.appendChild(dataRow);
    });
  } else {
    // If no data is found, show a message
    dataContainer.innerHTML = '<p>No items available in the stock.</p>';
  }
})
.catch(error => {
  console.error('Error fetching data:', error);
});

// Fetch data for item selection in the inventory management form
window.onload = function() {
    fetch('/php/manage_inventory_list.php')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('item-select');
            // Populate the select element with item options
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
};

// Function to handle the add or update stock operation
// Function to handle the add or update stock operation
function handleStockUpdate(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const itemId = document.getElementById('item-id').value;  // Item ID from the form
    const itemStock = document.getElementById('item-stock').value;  // Stock quantity from the form
    const action = document.querySelector('input[name="action"]:checked').value;  // Add or Update action

    const formData = new FormData();
    formData.append('item_id', itemId);
    formData.append('item_stock', itemStock);

    // Determine which action to perform (add or update)
    if (action === 'update-stock') {
        formData.append('update-stock', true);
    } else if (action === 'add-stock') {
        formData.append('add-stock', true);
    }

    // Send the request to the server
    fetch('/php/manage_inventory_list.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);  // Show success message
            window.location.href = 'admin_inventory.html';  // Redirect to admin inventory page
        } else {
            alert(data.error);  // Show error message if any
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your request');
    });
}

// Attach the function to your form submission
document.getElementById('stock-form').addEventListener('submit', handleStockUpdate);

