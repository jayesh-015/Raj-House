
// Raj House - My Account and Order History

const CURRENT_USER_KEY = "rajHouseUser";

// Check whether customer is logged in
const currentUser = JSON.parse(
    localStorage.getItem(CURRENT_USER_KEY)
);

if (!currentUser) {
    alert("Please login to access your account.");
    window.location.href = "login.html";
}

// Display customer details
if (currentUser) {
    document.getElementById("account-name").textContent =
        currentUser.name;

    document.getElementById("account-email").textContent =
        currentUser.email;
}

// Load order history
function displayOrderHistory() {

    const orders = JSON.parse(
        localStorage.getItem("rajHouseOrders")
    ) || [];

    const orderContainer =
        document.getElementById("order-history-list");

    // Show only the current customer's orders
    const userOrders = currentUser
        ? orders.filter(order =>
            order.customer.email.toLowerCase() ===
            currentUser.email.toLowerCase()
        )
        : [];

    if (userOrders.length === 0) {
        orderContainer.innerHTML = `
            <div class="empty-orders">
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet.</p>
                <a href="index.html#products" class="shop-now-btn">
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    orderContainer.innerHTML = userOrders
        .slice()
        .reverse()
        .map(order => {

            const orderDate = new Date(order.date)
                .toLocaleDateString("en-IN");

            return `
                <div class="order-card">

                    <div class="order-card-header">
                        <h3>Order #${order.id}</h3>
                        <span class="order-status">Placed</span>
                    </div>

                    <p><strong>Date:</strong> ${orderDate}</p>

                    <p><strong>Payment:</strong>
                        ${order.payment}
                    </p>

                    <p><strong>Delivery Address:</strong>
                        ${order.customer.address},
                        ${order.customer.city},
                        ${order.customer.state} -
                        ${order.customer.pincode}
                    </p>

                    <div class="ordered-products">
                        <strong>Products:</strong>
                        ${order.products.map(product => `
                            <p>${product.name} × ${product.quantity}
                            </p>
                        `).join("")}
                    </div>

                    <div class="order-total">
                        Total: ₹${Number(order.total).toFixed(2)}
                    </div>

                </div>
            `;
        }).join("");
}

// Logout customer
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);

    alert("You have been logged out successfully.");

    window.location.href = "index.html";
}

// Footer year
document.getElementById("footer-year").textContent =
    new Date().getFullYear();

// Display orders
if (currentUser) {
    displayOrderHistory();
}
