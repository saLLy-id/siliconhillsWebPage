// Product data
const products = [
    {
        id: 1,
        name: "ЛаксФорте",
        description: "Сильное слабительное средство быстрого действия. Эффект наступает через 2-3 часа.",
        price: 890,
        image: "https://source.unsplash.com/random/300x200/?medicine,pill"
    },
    {
        id: 2,
        name: "ГастроКлин",
        description: "Мягкое слабительное средство для регулярного применения. Не вызывает привыкания.",
        price: 650,
        image: "https://source.unsplash.com/random/300x200/?medicine,capsule"
    },
    {
        id: 3,
        name: "ЛаксЭкспресс",
        description: "Экспресс-решение для быстрого очищения кишечника. Действует уже через 30 минут.",
        price: 1200,
        image: "https://source.unsplash.com/random/300x200/?medicine,tablet"
    },
    {
        id: 4,
        name: "НатурЛакс",
        description: "Натуральное слабительное на основе растительных экстрактов. Бережное действие.",
        price: 750,
        image: "https://source.unsplash.com/random/300x200/?herbal,medicine"
    },
    {
        id: 5,
        name: "КишечникПро",
        description: "Комплексное средство для глубокого очищения кишечника. Курсовой прием.",
        price: 1450,
        image: "https://source.unsplash.com/random/300x200/?medicine,box"
    },
    {
        id: 6,
        name: "ЛаксМикс",
        description: "Комбинированное слабительное средство с пребиотиками для восстановления микрофлоры.",
        price: 980,
        image: "https://source.unsplash.com/random/300x200/?medicine,bottle"
    }
];

// DOM Elements
const productList = document.getElementById('product-list');
const cartModal = document.getElementById('cart-modal');
const cartButton = document.getElementById('cart-button');
const closeButtons = document.querySelectorAll('.close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutButton = document.getElementById('checkout-button');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const successModal = document.getElementById('success-modal');
const successClose = document.getElementById('success-close');

// Cart data
let cart = [];

// Initialize the page
function init() {
    displayProducts();
    setupEventListeners();
    
    // Check if cart exists in localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Display products on the page
function displayProducts() {
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price} ₽</div>
                <button class="btn add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        `;
        
        productList.appendChild(productCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Cart button
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        openCartModal();
    });
    
    // Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'none';
            successModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Checkout button
    checkoutButton.addEventListener('click', function() {
        if (cart.length > 0) {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'block';
        } else {
            alert('Ваша корзина пуста');
        }
    });
    
    // Checkout form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
    
    // Success close button
    successClose.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} добавлен в корзину`);
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Open cart modal
function openCartModal() {
    displayCartItems();
    cartModal.style.display = 'block';
}

// Display cart items
function displayCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Ваша корзина пуста</p>';
        cartTotalPrice.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} ₽</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" data-id="${item.id}">Удалить</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotalPrice.textContent = total;
    
    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            decreaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            increaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

// Increase item quantity
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
}

// Decrease item quantity
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity -= 1;
        
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        }
    }
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

// Process order
function processOrder() {
    // In a real application, you would send the order data to a server here
    
    // Clear cart
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Show success message
    checkoutModal.style.display = 'none';
    successModal.style.display = 'block';
    
    // Reset form
    checkoutForm.reset();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles for notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#8e44ad';
    notification.style.color = '#fff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.3)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Remove notification from DOM after animation
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
