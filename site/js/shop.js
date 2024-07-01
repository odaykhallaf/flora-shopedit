document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://your-backend-api.com/products'; // Update this to your API endpoint
    let currentPage = 1;
    const itemsPerPage = 16;
    const searchInput = document.querySelector('.form-control');
    const searchButton = document.getElementById('search-icon-1');
    let currentCategory = '';

    // Set session ID if not exists
    function initializeSession() {
        let sessionId = getCookie('sessionId');
        if (!sessionId) {
            sessionId = generateSessionId();
            setCookie('sessionId', sessionId, 7); // Session ID valid for 7 days
        }
    }

    // Generate a unique session ID
    function generateSessionId() {
        return 'session-' + Math.random().toString(36).substr(2, 16);
    }

    // Update the display of items in the cart
    function updateCartDisplay() {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-item-count').innerText = itemCount; // Ensure this ID matches your HTML
    }

    // Add an item to the cart
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let found = cart.find(p => p.id === product.id);
        if (found) {
            found.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        alert('Product added to cart successfully!');
        updateCartDisplay();
    }

    // Set cookie
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Get cookie
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Handle errors
    function handleError(error) {
        console.error('An error occurred:', error);
        alert('Failed to fetch products. Please try again later.');
    }

    // Fetch products from the backend using Axios
    function fetchProducts(page, category = '', keywords = '') {
        const url = `${apiUrl}?page=${page}&limit=${itemsPerPage}&category=${encodeURIComponent(category)}&search=${encodeURIComponent(keywords)}`;
        axios.get(url)
            .then(response => {
                const products = response.data.products;
                displayProducts(products);
                setupPagination(response.data.total, category, keywords);
            })
            .catch(handleError);
    }

    // Display products in the HTML
    function displayProducts(products) {
        const container = document.getElementById('product-container');
        container.innerHTML = ''; // Clear previous products
        products.forEach(product => {
            const productHtml = `
                <div class="col-md-6 col-lg-4 col-xl-3">
                    <div class="rounded position-relative fruite-item">
                        <div class="fruite-img">
                            <img src="${product.image}" class="img-fluid w-100 rounded-top" alt="${product.name}">
                        </div>
                        <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                            <div class="d-flex justify-content-between flex-lg-wrap">
                                <p class="text-dark fs-5 fw-bold mb-0">₪${product.price}</p>
                                <button onclick='addToCart(${JSON.stringify(product)})' class="btn border border-secondary rounded-pill px-3 text-primary">
                                    <i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += productHtml;
        });
    }

    // Setup pagination based on total items returned from the backend
    function setupPagination(totalItems, category, keywords) {
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = ''; // Clear previous pagination links
        for (let i = 1; i <= pageCount; i++) {
            paginationContainer.innerHTML += `<a href="#" class="rounded ${i === currentPage ? 'active' : ''}" onclick="changePage(${i}, '${category}', '${keywords}')">${i}</a>`;
        }
    }

    // Change page function to handle pagination
    window.changePage = (page, category, keywords) => {
        currentPage = page;
        fetchProducts(page, category, keywords);
    };

    // Handle search with debounce
    let searchDebounceTimer;
    searchInput.addEventListener('keyup', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            const keywords = searchInput.value.trim();
            fetchProducts(1, currentCategory, keywords);
            currentPage = 1;
        }, 300); // Delay in milliseconds
    });

    // Handle category selection
    const categoryLinks = document.querySelectorAll('.nav-pills .nav-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            const categoryName = this.textContent.trim();
            document.querySelectorAll('.nav-pills .nav-link').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            currentCategory = categoryName === 'All Products' ? '' : categoryName;
            fetchProducts(1, currentCategory, ''); // Fetch products of the selected category, clear any search
            currentPage = 1;
        });
    });

    // Initialize session and fetch initial products
    initializeSession();
    fetchProducts(currentPage);
    updateCartDisplay(); // Initial cart update
});
