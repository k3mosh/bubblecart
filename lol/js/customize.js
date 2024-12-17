document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.getElementById('add-to-cart');
    const cartTab = document.getElementById('cart-tab');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart');
    const checkoutButton = document.getElementById('checkout-btn');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    
    let cart = [];

    // Open/Close Cart Modal
    cartTab.addEventListener('click', () => toggleModal(cartModal, true));
    closeCartButton.addEventListener('click', () => toggleModal(cartModal, false));

    function toggleModal(modal, isOpen) {
        modal.classList.toggle('open', isOpen);
        cartTab.style.display = isOpen ? 'none' : 'flex';
    }

    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCart();
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update cart UI
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="checkout-item">
                    <!-- Product Image -->
                    <img src="${item.image}" alt="${item.name}" class="product-img">

                    <!-- Product Info and Controls -->
                    <div class="product-info">
                        <!-- Product Name and Price -->
                        <p class="product-name">${item.name} - ₱${item.price}</p>
                        
                        <!-- Quantity Controls -->
                        <div class="quantity-controls">
                            <button class="decrease-qty" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increase-qty" data-id="${item.id}">+</button>
                        </div>
                        
                        <!-- Remove Item Button -->
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;

            cartItem.querySelector('.decrease-qty').addEventListener('click', () => updateQuantity(item.uniqueId, -1));
            cartItem.querySelector('.increase-qty').addEventListener('click', () => updateQuantity(item.uniqueId, 1));
            cartItem.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.uniqueId));
            

            cartItemsContainer.appendChild(cartItem);
        });

        cartTotalElement.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }


    addToCartButton.addEventListener('click', () => {
        const drinkId = new URLSearchParams(window.location.search).get('id');
        const drinkName = document.getElementById('drink-name').textContent;
        const drinkImage = document.getElementById('drink-image').src;
        const drinkPrice = parseFloat(document.getElementById('drink-price').textContent.replace('₱', ''));
    
        // Get customization options
        const selectedSize = document.getElementById('size').value;
        const selectedMilk = document.getElementById('milk').value;
        const selectedSugar = document.getElementById('sugar-level').value;
        const selectedIce = document.getElementById('ice-level').value;
    
        // Get selected add-ons
        const addonElements = document.querySelectorAll('input[name="add-ons"]:checked');
        const selectedAddons = Array.from(addonElements).map(addon => ({
            name: addon.value,
            price: parseFloat(addon.getAttribute('data-price'))
        }));
    
        // Calculate the total price including add-ons

        const finalPrice = drinkPrice;
    
        // Create a unique identifier for this customized item
        const uniqueId = `${drinkId}-${selectedSize}-${selectedMilk}-${selectedSugar}-${selectedIce}-${selectedAddons.map(addon => addon.name).join('-')}`;
    
        // Check if an item with this uniqueId already exists in the cart
        const existingItem = cart.find(item => item.uniqueId === uniqueId);
    
        if (existingItem) {
            // If the item exists, increase the quantity
            existingItem.quantity++;
        } else {
            // If the item doesn't exist, add a new entry to the cart
            cart.push({
                uniqueId: uniqueId,
                id: drinkId,
                name: drinkName,
                image: drinkImage,
                price: finalPrice,
                size: selectedSize,
                milk: selectedMilk,
                sugar: selectedSugar,
                ice: selectedIce,
                addons: selectedAddons,
                quantity: 1
            });
        }
    
        saveCart();
        updateCart();
    });
    
    // Remove item from the cart
 // Remove item from the cart
function removeFromCart(uniqueId) {
    cart = cart.filter(cartItem => cartItem.uniqueId !== uniqueId);
    updateCart();
    saveCart();
}

// Update item quantity
function updateQuantity(uniqueId, delta) {
    const item = cart.find(cartItem => cartItem.uniqueId === uniqueId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(uniqueId);
        } else {
            updateCart();
            saveCart();
        }
    }
}


    // Handle checkout button


    checkoutButton.addEventListener('click', () => {
        const username = sessionStorage.getItem('username');
   
    
        if (!username) {
            alert('You must be logged in to proceed with checkout!');
            window.location.href = 'login.html'; // Redirect to login page
            return;
        }
    
        if (!cart.length) {
            alert('Your cart is empty!');
            return;
        }
    
        // Fetch user details and show order summary
        fetch('fetch_user_details.php')
            .then(response => response.json())
            .then(user => {
                if (user && user.username) {
                    // User is logged in, proceed to checkout
                    const checkoutModal = document.createElement('div');
                    checkoutModal.className = 'checkout-modal';
                    checkoutModal.innerHTML = `
                        <div class="checkout-content">
                            <h2>Order Summary</h2>
                            <p><strong>Name:</strong> ${user.username}</p>
                            <p><strong>Phone:</strong> ${user.phone || 'Not available'}</p>
                            <p><strong>Address:</strong> ${user.address || 'Not available'}</p>
                            <h3>Items:</h3>
                            <ul>
                                ${cart.map(item => `
                                    <li>
                                        <div class="item-summary">
                                            <span class="item-name">${item.name}</span>
                                            <span class="item-quantity">(₱${item.price} x ${item.quantity})</span>
                                            <span class="item-total">₱${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                 
                                            <div class="customization-details" style="display: none;">
                                                <p><strong>Size:</strong> ${item.size}</p>
                                                <p><strong>Milk Base:</strong> ${item.milk}</p>
                                                <p><strong>Sugar Level:</strong> ${item.sugar}</p>
                                                <p><strong>Ice Level:</strong> ${item.ice}</p>
                                                <p><strong>Add-ons:</strong> ${
                                                    item.addons.length > 0 
                                                        ? item.addons.map(addon => `${addon.name} (₱${addon.price.toFixed(2)})`).join(', ') 
                                                        : 'None'
                                                }</p>
                                            </div>
 
                                    </li>
                                `).join('')}
                            </ul>
                            <h3>Total: ₱${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
                            <button class="btn btn-primary confirm-order">Confirm Order</button>
                            <button class="btn btn-secondary cancel-order">Cancel</button>
                        </div>
                    `;
    
                    document.body.appendChild(checkoutModal);
    
                    // Add functionality to toggle customizations visibility
                    const toggleButtons = checkoutModal.querySelectorAll('.toggle-customizations');
                    toggleButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            const details = button.nextElementSibling;
                            details.style.display = details.style.display === 'none' ? 'block' : 'none';
                        });
                    });
    
                    const confirmOrderButton = checkoutModal.querySelector('.confirm-order');
                    confirmOrderButton.addEventListener('click', () => {
                        // Prepare the order data to be sent to the PHP backend
                        const orderData = {
                            username: username,
                            items: cart.map(item => ({
                                itemName: item.name,
                                quantity: item.quantity,
                                price: item.price,
                                size: item.size,
                                milkBase: item.milk,
                                sugarLevel: item.sugar,
                                iceLevel: item.ice,
                                addons: item.addons.map(addon => `${addon.name} (₱${addon.price.toFixed(2)})`).join(', ')
                            })),
                            totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
                        };
    
                        // Send order data to the server
                        fetch('process_order.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(orderData),
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert('Order confirmed! Thank you for your purchase.');
                                cart = [];
                                updateCart();
                                saveCart();
                                document.body.removeChild(checkoutModal);
                            } else {
                                alert('Failed to process your order. Please try again.');
                            }
                        })
                        .catch(error => {
                            console.error('Error processing order:', error);
                            alert('Failed to process your order. Please try again.');
                        });
                    });
    
                    const cancelOrderButton = checkoutModal.querySelector('.cancel-order');
                    cancelOrderButton.addEventListener('click', () => {
                        document.body.removeChild(checkoutModal);
                    });
                } else {
                    alert('Please log in to proceed with checkout.');
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                alert('Failed to fetch user details. Please try again.');
            });
    });
    

    // Load the cart from localStorage on page load
    loadCart();
});
// Initialize the base price
let basePrice = 70;

// Fetch the drink details using the ID in the URL
function fetchDrinkDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const drinkId = urlParams.get('id');

    fetch(`get_drink.php?id=${drinkId}`)
        .then(response => response.json())
        .then(data => {
            basePrice = data.price;

            document.getElementById('drink-name').textContent = data.name || 'Unknown Drink';
            document.getElementById('drink-image').src = data.image_url || './asset/default-image.png';
            document.getElementById('drink-description').textContent = data.description || 'No description available.';
            document.getElementById('price-span').textContent = basePrice;
            
            updatePrice();  // Update the price when the page loads
        })
        .catch(error => console.error('Error fetching drink details:', error));
}
function checkLoginStatus() {
    const username = sessionStorage.getItem('username'); // Example: Check if session storage has a logged-in value

    if (username) {
        // If logged in, show account and admin icon, hide login and signup links
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('signup-link').style.display = 'none';
        document.getElementById('account-tab').style.display = 'inline-block';
        document.querySelector('.admin-icon').style.display = 'block';
    } else {
        // If not logged in, show login and signup links, hide account and admin icon
        document.getElementById('login-link').style.display = 'inline-block';
        document.getElementById('signup-link').style.display = 'inline-block';
        document.getElementById('account-tab').style.display = 'none';
        document.querySelector('.admin-icon').style.display = 'block';
    }
}
// Update the price when the user changes options
function updatePrice() {
    let totalPrice = basePrice;

    // Get selected size price
    let selectedSize = document.getElementById('size');
    let sizePrice = selectedSize.options[selectedSize.selectedIndex].getAttribute('data-price');
    totalPrice = parseFloat(sizePrice); // Update the total price to the size price

    // Add the selected add-ons prices
    let addOns = document.querySelectorAll('input[name="add-ons"]:checked');
    addOns.forEach(function(addOn) {
        totalPrice += parseFloat(addOn.getAttribute('data-price'));
    });

    // Update the displayed total price
    document.getElementById('drink-price').textContent = '₱' + totalPrice.toFixed(2);
}

checkLoginStatus(); 
fetchDrinkDetails();
console.log(sessionStorage.getItem('username'));

