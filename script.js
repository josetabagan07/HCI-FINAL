 // Product Database
        const products = [
            { id: 1, name: "Fried Chicken /w Rice", price: 79.99, category: "Rice Meals", img: "FriedChicken.jpg" },
            { id: 2, name: "Chicken Adobo /w Rice", price: 89.99, category: "Rice Meals", img: "adobo.jpg" },
            { id: 3, name: "Beef Tapa /w Rice", price: 99.99, category: "Rice Meals", img: "beeftapa.jpg" },
            { id: 4, name: "Pork Sisig /w Rice", price: 99.99, category: "Rice Meals", img: "PorkSisig.jpg" },
            { id: 5, name: "Denise Plushie Fries", price: 24.99, category: "Snacks", img: "FrenchFries.jpg" },
            { id: 6, name: "TuRon", price: 19.99, category: "Snacks", img: "turon.jpg" },
            { id: 8, name: "Joselito Onion Rings", price: 19.50, category: "Snacks", img: "onionrings.jpg" },
            { id: 9, name: "Compound V Cola", price: 24.99, category: "Drinks", img: "compoundcola.jpg" },
            { id: 10, name: "AliSmoothie", price: 39.99, category: "Drinks", img: "AliSmoothie.jpg" },
            { id: 11, name: "Cedie Coffee", price: 34.99, category: "Drinks", img: "CedieCoffee.jpg" },
            { id: 12, name: "Water", price: 19.50, category: "Drinks", img: "water.jpg" }
        ];

        let currentCategory = 'All';
        let cart = [];

        // Initialize App
        function init() {
            renderProducts();
            initVideoAd();
        }

        // Set Category
        function setCategory(category) {
            currentCategory = category;
            
            // Update active button styling
            const buttons = document.querySelectorAll('.categories button');
            buttons.forEach(btn => {
                if(btn.innerText === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            renderProducts();
        }

        // Sort Products
        function sortProducts() {
            renderProducts();
        }

        // Render Products to Grid
        function renderProducts() {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = '';

            let filteredProducts = products.filter(p => currentCategory === 'All' || p.category === currentCategory);

            const searchQuery = document.getElementById('search-input').value.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchQuery));
            
            const sortType = document.getElementById('sort-select').value;
            
            if (sortType === 'low-high') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortType === 'high-low') {
                filteredProducts.sort((a, b) => b.price - a.price);
            } else if (sortType === 'a-z') {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else {
                // Default sorting by ID
                filteredProducts.sort((a, b) => a.id - b.id);
            }

            filteredProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.img}" alt="${product.name}" class="product-image">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">₱${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                grid.appendChild(card);
            });
        }

        // Add item to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.product.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ product: product, quantity: 1 });
            }

            renderCart();
        }

        // Render Cart items
        function renderCart() {
            const container = document.getElementById('cart-items-container');
            const totalElement = document.getElementById('cart-total-price');
            container.innerHTML = '';
            
            let total = 0;

            if (cart.length === 0) {
                container.innerHTML = '<p style="text-align:center; color:#888;">Your CART is empty!</p>';
            }

            cart.forEach((item, index) => {
                total += item.product.price * item.quantity;

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.product.img}" alt="${item.product.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.product.name}</div>
                        <div class="cart-item-price">₱${item.product.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                `;
                container.appendChild(cartItem);
            });

            totalElement.innerText = total.toFixed(2);
        }

        // Checkout & Download Receipt
        function checkout() {
            if (cart.length === 0) {
                alert("Please add items to your cart before checking out!");
                return;
            }

            // 1. Generate Receipt Text
            let receiptText = "========================================\n";
            receiptText +=    "              HERO BITES                \n";
            receiptText +=    "         Power Up Your Hunger!          \n";
            receiptText +=    "========================================\n\n";
            receiptText +=    "RECEIPT OF PURCHASE\n";
            receiptText +=    "Date: " + new Date().toLocaleString() + "\n\n";
            
            let total = 0;
            cart.forEach(item => {
                let lineTotal = item.product.price * item.quantity;
                total += lineTotal;
                receiptText += `${item.product.name} (x${item.quantity})\n`;
                receiptText += `   ₱${item.product.price.toFixed(2)}    ................. ₱${lineTotal.toFixed(2)}\n`;
            });

            receiptText += "\n----------------------------------------\n";
            receiptText += `GRAND TOTAL:                     ₱${total.toFixed(2)}\n`;
            receiptText += "----------------------------------------\n\n";
            receiptText += "Thank you for eating like a Hero!\n";
            receiptText += "You are the real Hero!\n";
            receiptText += "Captain Cedie is proud of you!!!\n";


            // 2. Trigger Download
            const blob = new Blob([receiptText], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `Hero_Bites_Receipt_${new Date().getTime()}.txt`;
            link.click();

            // 3. Clear Cart
            cart = [];
            renderCart();
            alert("Checkout successful! Your receipt is downloading.");
        }

        // Run on load
        window.onload = init;

        /* Pop-up Ad Logic */
function initVideoAd() {
    // Shows the ad after a 2-second delay
    setTimeout(() => {
        const adContainer = document.getElementById('hero-ad-popup');
        const videoElement = document.getElementById('ad-video');
        
        if (adContainer && videoElement) {
            adContainer.style.display = 'flex';
            videoElement.play().catch(err => {
                console.log("Autoplay prevented by browser context.");
            });
        }
    }, 2000);
}

function closeAd() {
    const adContainer = document.getElementById('hero-ad-popup');
    const videoElement = document.getElementById('ad-video');
    
    if (adContainer && videoElement) {
        adContainer.style.display = 'none';
        videoElement.pause(); // Stops video playback
    }
}
