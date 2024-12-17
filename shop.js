document.addEventListener('DOMContentLoaded', () => {
    const cartTab = document.getElementById('cart-tab');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart');
    const checkoutButton = document.getElementById('checkout-btn');
    const flavorsContainer = document.getElementById('flavors-container');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    let cart = [];

    // Open/Close Cart Modal
    cartTab.addEventListener('click', () => toggleModal(cartModal, true));
    closeCartButton.addEventListener('click', () => toggleModal(cartModal, false));

    function toggleModal(modal, isOpen) {
        modal.classList.toggle('open', isOpen);
        cartTab.style.display = isOpen ? 'none' : 'flex';
    }

    // Load Menu Items
    function loadMenuItems() {
        fetch('fetch_menu_items.php')
            .then(response => response.text())
            .then(data => {
                flavorsContainer.innerHTML = data;
                attachAddToCartListeners();
            })
            .catch(error => {
                console.error('Error fetching menu items:', error);
                flavorsContainer.innerHTML = "<p>Error loading menu items.</p>";
            });
    }

    // Attach "Add to Cart" functionality
    function attachAddToCartListeners() {
        const flavorCards = document.querySelectorAll('.flavor-card'); // Get all flavor cards
        flavorCards.forEach(card => {
            // Add click event to the card
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.cart-icon')) { // Prevent conflict with "Add to Cart" button
                    const id = card.dataset.id;
                    redirectToCustomizePage(id);
                }
            });

            // Handle "Add to Cart" button separately
            const cartIcon = card.querySelector('.cart-icon');
            if (cartIcon) {
                cartIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    const stockStatus = card.classList.contains('out-of-stock');
                    if (stockStatus) {
                        alert('Sorry, this item is out of stock!');
                        return;
                    }
                    const id = card.dataset.id;
                    const name = card.querySelector('p').textContent;
                    const price = parseFloat(card.querySelector('.price-tag').textContent.replace('₱', ''));
                    const image = card.querySelector('img').src;

                    if (id && name && !isNaN(price)) {
                        addToCart({ id, name, price, image });
                    } else {
                        console.error('Invalid menu item data:', { id, name, price });
                    }
                });
            }
        });
    }

    function redirectToCustomizePage(itemId) {
        const card = document.querySelector(`.flavor-card[data-id="${itemId}"]`);
        
        if (!card || card.classList.contains('out-of-stock')) {
            alert('Sorry, this item is out of stock');
            return;
        }

        saveCart(); // Save the current cart to localStorage
    }

    // Add item to the cart
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            item.quantity = 1;
            cart.push(item);
        }
        updateCart();
        saveCart();
    }

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

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCart();
        }
    }

    // Update Cart UI
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

    checkoutButton.addEventListener('click', () => {
        const username = sessionStorage.getItem('username');
   
    
        if (!username) {
            alert('You must be logged in to proceed with checkout!');
            window.location.href = 'user_login.html'; // Redirect to login page
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
                    window.location.href = 'user_login.html';
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                alert('Failed to fetch user details. Please try again.');
            });
    });
    // Function to check if the user is logged in
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

    // Initialize functions
    loadMenuItems();
    loadCart();
    checkLoginStatus();
});
