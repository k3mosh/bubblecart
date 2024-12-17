
const firstForm = document.getElementById('first-form');
const secondForm = document.getElementById('second-form');

const nextBtn = document.getElementById('next-btn');

nextBtn.addEventListener('click', () => {
firstForm.classList.add('hidden');
secondForm.classList.remove('hidden');
});


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

// Check if the URL contains the "status=success" parameter
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('status') === 'success') {
    alert('Product added successfully!');
    // Remove the query parameter from the URL after showing the alert
    const urlWithoutParams = window.location.href.split('?')[0];
    history.replaceState(null, '', urlWithoutParams);
}

// Function to fetch and populate product data


async function fetchMenuItems() {
    try {
        const response = await fetch('/php/edit_items.php');
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const menuItems = await response.json();

        // Clear existing content
        const menuContainer = document.getElementById('menu-container');
        menuContainer.innerHTML = '';

        // Loop through items and render cards
        menuItems.forEach(item => {
            const stockClass = item.stock_quantity > 0 ? "" : "out-of-stock";
            const card = document.createElement('div');
            card.className = `w-[160px] h-[200px] bg-[#2B8A6D] m-2 flex justify-center items-center rounded-[20px] p-3 md:w-[220px] md:h-[290px] ${stockClass}`;
            card.innerHTML = `
                <div class="w-[250px] h-[200px] bg-[#2B8A6D] m-2 flex justify-center items-center rounded-[20px] p-3 md:w-[220px] md:h-[290px]  flex-col">
                    <div class="w-full h-3/5 px-5">
                        <div class="flex-row w-full h-full flex justify-center items-center bg-[#A8E6CF] rounded-lg">
                            <img src="${item.image}" alt="${item.name}" class="w-auto h-24 md:h-28">
                        </div>
                    </div>

                    <div class="w-full h-2/5 flex flex-row justify-center items-center">
                        <div class="w-2/3 h-full flex justify-center items-center">
                            <p class="text-center font-baloo2 text-[16px] font-bold text-[#A8E6CF] md:text-[22px]">${item.name}</p>
                        </div>
                        <div class="w-1/3 flex justify-center items-center">
                            <p class="text-center font-baloo2 text-[16px] font-bold text-[#A8E6CF] md:text-[22px]">₱${item.price}</p>
                        </div>
                    </div>

                    ${item.stock_quantity > 0
                        ? `<div class="w-full h-1/5 flex justify-center items-center gap-2">
                            <button class="w-1/2 h-full md:text-[22px] bg-[#A8E6CF] text-[#2B8A6D] font-bold rounded-lg font-baloo2 edit-btn" data-id="${item.id}">Edit</button>
                            <button class="w-1/2 h-full md:text-[22px] bg-[#A8E6CF] text-[#2B8A6D] font-bold rounded-lg font-baloo2 delete-btn"  data-id="${item.id}">Delete</button>
                        </div>`
                        : `<p class="text-red-600 font-bold">Out of Stock</p>`
                    }
                </div>
            `;
            menuContainer.appendChild(card);
        });
        async function getItemDataById(itemId) {
            try {
                const response = await fetch(`/php/edit_product.php?id=${itemId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item data');
                }
                const itemData = await response.json();
                return itemData;
            } catch (error) {
                console.error('Error fetching item data:', error);
                return null;
            }
        }
        
        // Add event listeners after items have been rendered
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                getItemDataById(itemId).then(itemData => {
                    if (itemData) {
                        const editForm = document.getElementById('edit-form');
                        const inputFields = editForm.querySelectorAll('input, textarea');
                        const itemIdField = editForm.querySelector('#item_id');
                        itemIdField.value = itemId;

                        inputFields.forEach(field => {
                            const fieldName = field.name;
                            if (itemData.hasOwnProperty(fieldName)) {
                                field.value = itemData[fieldName];
                            }
                        });

                        editForm.classList.remove('hidden');
                    } else {
                        console.error('No data found for item ID:', itemId);
                    }
                }).catch(error => {
                    console.error('Error fetching item data:', error);
                    alert('Error loading item data.');
                });
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                const confirmation = confirm('Are you sure you want to delete this product?');
                if (confirmation) {
                    deleteProduct(itemId);
                }
            });
        });
    } catch (error) {
        console.error(error);
        alert('Error loading menu items.');
    }
}


document.getElementById('save-edit-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    const productName = document.getElementById('name').value;
    const itemPrice = document.getElementById('price').value;
    const description = document.getElementById('desc').value;

    //console.log(description);

    // Get the product ID (assuming you have it in a hidden input or as a data attribute on the form)
    const itemIdElement = document.getElementById('item_id'); // Get the element
    if (!itemIdElement) {
        alert('Product ID is missing!');
        return; // Exit if the item ID is not found
    }

    const itemId = itemIdElement.value; // Get the item ID value

    // Create an object with the data to send
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', itemPrice);
    formData.append('description', description); // Ensure the description is included
    formData.append('id', itemId);
    
    // Send the data using XMLHttpRequest or Fetch API
    updateProduct(formData);
});

function updateProduct(formData) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/php/update_product.php', true); // Adjust the PHP script path accordingly
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert('Product updated successfully!');
                // Optionally, redirect or refresh the page
                window.location.href = 'admin_editmenu.html'; // Redirect to the edit menu page
            } else {
                alert('Failed to update product: ' + response.error);
            }
        } else {
            alert('Error updating product.');
        }
    };
    xhr.onerror = function() {
        alert('Request error');
    };
    xhr.send(formData);
}

// Add click event listener to each delete button
const deleteButtons = document.querySelectorAll('.delete-btn');

deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id'); // Get the item ID from data-id attribute
        console.log('Delete button clicked for item with ID:', itemId);

        // Confirm deletion
        const confirmation = confirm('Are you sure you want to delete this product?');
        if (confirmation) {
            deleteProduct(itemId); // Call deleteProduct function
        }
    });
});

// Function to delete the product
function deleteProduct(itemId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/php/delete_product.php', true); // Adjust the PHP script path accordingly
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Set content type
    xhr.onload = function() {
        console.log(xhr.responseText); // Log the response before parsing
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    alert('Product deleted successfully!');
                    window.location.reload(); // Reload the page to see the changes
                } else {
                    alert('Failed to delete product: ' + response.error);
                }
            } catch (error) {
                alert('Failed to parse response: ' + error);
                console.error(error);
            }
        } else {
            alert('Error deleting product.');
        }
    
    
    };
    xhr.onerror = function() {
        alert('Request error');
    };
    xhr.send(`id=${itemId}`); // Send product ID to the server
}





// Call the function on page load
fetchMenuItems();

