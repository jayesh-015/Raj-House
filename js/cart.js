
// RAJ HOUSE - SHOPPING CART SYSTEM

// Load saved cart from browser storage
let cart = JSON.parse(localStorage.getItem("rajHouseCart")) || [];

// Save cart
function saveCart() {
    localStorage.setItem("rajHouseCart", JSON.stringify(cart));
}

// Update cart display
function displayCart() {

    const cartContainer = document.getElementById("cart-items");

    const subtotalElement = document.getElementById("cart-subtotal");
    const deliveryElement = document.getElementById("delivery-charge");
    const totalElement = document.getElementById("cart-total");
    const countElement = document.getElementById("cart-items-count");

    let subtotal = 0;
    let totalItems = 0;

    cartContainer.innerHTML = "";

    // Empty cart
    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty!</h2>
                <p>Discover something adorable for your little ones.</p>
                <a href="index.html#products" class="continue-btn">
                    Start Shopping →
                </a>
            </div>
        `;

        subtotalElement.textContent = "₹0";
        deliveryElement.textContent = "₹0";
        totalElement.textContent = "₹0";
        countElement.textContent = "0 Items";

        return;
    }

    // Display cart products
    cart.forEach(item => {

        const product = products.find(
            product => product.id === item.id
        );

        if (!product) return;

        const itemTotal = product.price * item.quantity;

        subtotal += itemTotal;
        totalItems += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-item-info">

                <h3>${product.name}</h3>

                <p>₹${product.price} each</p>

                <div class="quantity-controls">

                    <button class="quantity-btn"
                        data-action="decrease"
                        data-id="${product.id}">−</button>

                    <span>${item.quantity}</span>

                    <button class="quantity-btn"
                        data-action="increase"
                        data-id="${product.id}">+</button>

                </div>

            </div>

            <div class="cart-item-right">

                <strong>₹${itemTotal}</strong>

                <button class="remove-btn"
                    data-action="remove"
                    data-id="${product.id}">
                    Remove
                </button>

            </div>
        `;

        cartContainer.appendChild(cartItem);

    });

    // Delivery calculation
    const delivery = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 49;

    const total = subtotal + delivery;

    // Update order summary
    subtotalElement.textContent = "₹" + subtotal;

    deliveryElement.textContent =
        delivery === 0 && subtotal > 0
            ? "FREE"
            : "₹" + delivery;

    totalElement.textContent = "₹" + total;

    countElement.textContent =
        totalItems + (totalItems === 1 ? " Item" : " Items");

}

// Handle cart buttons
document.getElementById("cart-items").addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;

    const item = cart.find(product => product.id === productId);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== productId);
        }
    }

    if (action === "remove") {
        cart = cart.filter(product => product.id !== productId);
    }

    saveCart();
    displayCart();

});

// Proceed to checkout
function goToCheckout() {

    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
    }

    window.location.href = "checkout.html";

}

// Display cart when page loads
document.getElementById("year").textContent =
    new Date().getFullYear();

displayCart();
