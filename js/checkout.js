
// RAJ HOUSE - CHECKOUT SYSTEM

// Load cart
let cart = JSON.parse(localStorage.getItem("rajHouseCart")) || [];

// Update copyright year
document.getElementById("year").textContent =
    new Date().getFullYear();

// Calculate order details
function getOrderDetails() {

    let subtotal = 0;

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (product) {
            subtotal += product.price * item.quantity;
        }

    });

    const delivery = subtotal >= 999 ? 0 : 49;

    return {
        subtotal: subtotal,
        delivery: subtotal === 0 ? 0 : delivery,
        total: subtotal + (subtotal === 0 ? 0 : delivery)
    };

}

// Display checkout products
function displayCheckout() {

    const container = document.getElementById("checkout-products");

    container.innerHTML = "";

    if (cart.length === 0) {

        container.textContent = "Your cart is empty.";

        document.querySelector(".place-order-btn").disabled = true;

        return;
    }

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const row = document.createElement("div");

        row.className = "checkout-product";

        row.innerHTML = `
            <div>
                <strong>${product.name}</strong>
                <p>Quantity: ${item.quantity}</p>
            </div>

            <span>₹${product.price * item.quantity}</span>
        `;

        container.appendChild(row);

    });

    const details = getOrderDetails();

    document.getElementById("checkout-subtotal").textContent =
        "₹" + details.subtotal;

    document.getElementById("checkout-delivery").textContent =
        details.delivery === 0 ? "FREE" : "₹" + details.delivery;

    document.getElementById("checkout-total").textContent =
        "₹" + details.total;

}

// Safely display user-entered information in confirmation
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

}

// Place order
document.getElementById("checkout-form").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!this.reportValidity()) {
            return;
        }

        const details = getOrderDetails();

        const customer = {
            name: document.getElementById("customer-name").value.trim(),
            phone: document.getElementById("customer-phone").value.trim(),
            email: document.getElementById("customer-email").value.trim(),
            address: document.getElementById("customer-address").value.trim(),
            city: document.getElementById("customer-city").value.trim(),
            state: document.getElementById("customer-state").value.trim(),
            pin: document.getElementById("customer-pin").value.trim()
        };

        const payment = document.querySelector(
            'input[name="payment"]:checked'
        ).value;

        // Generate order ID
        const orderId = "RH" + Date.now();

        // Save order
        const order = {
            orderId: orderId,
            customer: customer,
            products: cart.map(item => {
                const product = products.find(p => p.id === item.id);

                return {
                    id: item.id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity
                };
            }),
            payment: payment,
            subtotal: details.subtotal,
            delivery: details.delivery,
            total: details.total,
            date: new Date().toLocaleString()
        };

        // Store latest order
        localStorage.setItem(
            "rajHouseLastOrder",
            JSON.stringify(order)
        );

        // Store order history
        let orders = JSON.parse(
            localStorage.getItem("rajHouseOrders")
        ) || [];

        orders.push(order);

        localStorage.setItem(
            "rajHouseOrders",
            JSON.stringify(orders)
        );

        // Clear shopping cart
        localStorage.removeItem("rajHouseCart");

        // Show confirmation
        showConfirmation(order);

    }
);

// Show successful order confirmation
function showConfirmation(order) {

    const main = document.querySelector(".checkout-page");

    main.innerHTML = `
        <div class="order-success">

            <div class="success-icon">✓</div>

            <p class="eyebrow">THANK YOU FOR SHOPPING WITH US</p>

            <h1>Order Placed Successfully!</h1>

            <p class="success-message">
                Thank you, ${escapeHTML(order.customer.name)}!
                Your order has been received.
            </p>

            <div class="order-details">

                <h2>Order Details</h2>

                <p>
                    <strong>Order ID:</strong>
                    ${escapeHTML(order.orderId)}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${escapeHTML(order.payment)}
                </p>

                <p>
                    <strong>Delivery Address:</strong>
                    ${escapeHTML(order.customer.address)},
                    ${escapeHTML(order.customer.city)},
                    ${escapeHTML(order.customer.state)}
                    - ${escapeHTML(order.customer.pin)}
                </p>

                <p>
                    <strong>Total Amount:</strong>
                    ₹${order.total}
                </p>

                <p>
                    <strong>Order Date:</strong>
                    ${escapeHTML(order.date)}
                </p>

            </div>

            <a href="index.html" class="continue-btn">
                Continue Shopping →
            </a>

        </div>
    `;

    window.scrollTo(0, 0);

}

// Initialize checkout
displayCheckout();
