

// RAJ HOUSE - MAIN JAVASCRIPT

// Update copyright year
document.getElementById("year").textContent =
    new Date().getFullYear();

console.log("Welcome to Raj House!");

// Load saved cart
let cart = JSON.parse(localStorage.getItem("rajHouseCart")) || [];

// Update cart count
function updateCartCount() {
    const count = document.getElementById("cart-count");

    if (count) {
        count.textContent = cart.reduce(
            (total, item) => total + item.quantity, 0
        );
    }
}

// Display products
function displayProducts(category = "all") {

    const productGrid = document.getElementById("product-grid");

    const filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);

    productGrid.innerHTML = "";

    filteredProducts.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-price">
                    ₹${product.price}
                </div>

                <button class="add-cart-btn"
                    data-id="${product.id}">
                    Add to Cart
                </button>

            </div>
        `;

        productGrid.appendChild(card);

    });

    // Add cart button functionality
    document.querySelectorAll(".add-cart-btn").forEach(button => {

        button.addEventListener("click", function() {

            const productId = Number(this.dataset.id);

            const existingProduct = cart.find(
                item => item.id === productId
            );

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    id: productId,
                    quantity: 1
                });
            }

            localStorage.setItem(
                "rajHouseCart",
                JSON.stringify(cart)
            );

            updateCartCount();

            this.textContent = "Added ✓";

            setTimeout(() => {
                this.textContent = "Add to Cart";
            }, 1000);

        });

    });

}

// Category filter functionality
document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        displayProducts(this.dataset.filter);

    });

});

// Start website
displayProducts();

updateCartCount();