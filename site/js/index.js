document.addEventListener("DOMContentLoaded", function() {
    // Initialize Swiper
    var swiper = new Swiper('.swiper-container', {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
    });

    // Preloader
    var preloader = document.querySelector('.preloader');
    window.addEventListener('load', function() {
        preloader.style.display = 'none';
    });

    // Search functionality
    var searchButton = document.querySelector('.btn-outline-primary');
    var searchInput = document.querySelector('.form-control');

    searchButton.addEventListener('click', function() {
        var query = searchInput.value.trim();
        if (query) {
            // Send search query to backend
            axios.get('https://your-backend-api.com/search', {
                params: {
                    q: query
                }
            })
            .then(function(response) {
                // Handle successful response
                console.log(response.data);
                // Redirect or update UI based on response
            })
            .catch(function(error) {
                // Handle error
                console.error(error);
            });
        }
    });

    // Function to fetch plants data with pagination
    function fetchPlants(page = 1, categoryId = null) {
        let url = `https://your-backend-api.com/plants?page=${page}&limit=9`;
        if (categoryId) {
            url += `&category=${categoryId}`;
        }

        axios.get(url)
        .then(function(response) {
            // Update UI with plants data
            updatePlantsUI(response.data.plants);
            // Update pagination controls
            updatePagination(response.data.totalPages, page);
        })
        .catch(function(error) {
            // Handle error
            console.error(error);
        });
    }

    // Function to update plants UI
    function updatePlantsUI(plants) {
        var plantsContainer = document.querySelector('.row.row-30');
        plantsContainer.innerHTML = ''; // Clear existing content
        plants.forEach(function(plant) {
            var plantElement = `
                <div class="col-lg-4 col-sm-6">
                  <div class="box-product">
                    <div class="box-product-img"><a href="plantpage.html?id=${plant.id}"><img src="${plant.image}" alt="${plant.name}" width="270" height="264" loading="lazy"/></a></div>
                    <p><a href="plantpage.html?id=${plant.id}">${plant.name}</a></p>
                    <p>${plant.description}</p>
                    <div class="group-sm"><span class="box-product-price">${plant.price}</span></div>
                    <a class="button button-xs button-primary" href="plantpage.html?id=${plant.id}">Show details</a>
                  </div>
                </div>
            `;
            plantsContainer.insertAdjacentHTML('beforeend', plantElement);
        });
    }

    // Function to update pagination UI
    function updatePagination(totalPages, currentPage) {
        var paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = ''; // Clear existing pagination
        for (let i = 1; i <= totalPages; i++) {
            var pageItem = `<a href="#" class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
            paginationContainer.insertAdjacentHTML('beforeend', pageItem);
        }

        // Add click event listeners to pagination links
        var pageLinks = document.querySelectorAll('.pagination .page-link');
        pageLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                var page = this.getAttribute('data-page');
                fetchPlants(page);
            });
        });
    }

    // Initial fetch for plants and categories on page load
    fetchPlants();
    fetchCategories();

    // Navbar toggle functionality
    var navbarToggle = document.querySelector('.rd-navbar-toggle');
    var navbarNavWrap = document.querySelector('.rd-navbar-nav-wrap');

    navbarToggle.addEventListener('click', function() {
        navbarNavWrap.classList.toggle('open');
    });

    // Social media links handling
    var socialLinks = document.querySelectorAll('.fa-facebook, .fa-google-plus, .fa-linkedin, .fa-twitter');

    socialLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Social media link clicked!');
        });
    });

    // Newsletter form submission
    var newsletterForm = document.querySelector('.newsletter-form');
    var emailInput = document.querySelector('.newsletter-form input[type="text"]');

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var email = emailInput.value.trim();
        if (email) {
            axios.post('https://your-backend-api.com/newsletter', { email: email })
            .then(function(response) {
                alert('Thank you for subscribing!');
                emailInput.value = ''; // Clear the input field
            })
            .catch(function(error) {
                console.error(error);
                alert('There was an error subscribing. Please try again later.');
            });
        } else {
            alert('Please enter a valid email address.');
        }
    });
});
