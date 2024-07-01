(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });

    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });

    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });

    // Product Quantity
    function bindQuantityButtons() {
        $('.quantity button').off('click').on('click', function () {
            var button = $(this);
            var oldValue = button.parent().parent().find('input').val();
            var newVal;
            if (button.hasClass('btn-plus')) {
                newVal = parseFloat(oldValue) + 1;
            } else {
                if (oldValue > 0) {
                    newVal = parseFloat(oldValue) - 1;
                } else {
                    newVal = 0;
                }
            }
            button.parent().parent().find('input').val(newVal);
            updateTotal();
            updateSessionStorage();
        });
    }

    // Remove item from cart
    function bindRemoveButtons() {
        $('.btn-times').off('click').on('click', function () {
            $(this).closest('tr').remove();
            updateTotal();
            updateSessionStorage();
        });
    }

    // Update total price
    function updateTotal() {
        var total = 0;
        $('tbody tr').each(function () {
            var price = parseFloat($(this).find('td:nth-child(3) p').text().replace('₪', ''));
            var quantity = parseFloat($(this).find('input').val());
            var itemTotal = price * quantity;
            $(this).find('td:nth-child(5) p').text(itemTotal.toFixed(2) + ' ₪');
            total += itemTotal;
        });
        $('#total').text(total.toFixed(2) + ' ₪');
    }

    // Apply coupon code (dummy implementation)
    $('.button-primary').on('click', function () {
        var coupon = $('#coupon-code').val();
        if (coupon === 'DISCOUNT10') {
            var total = parseFloat($('#total').text().replace('₪', ''));
            var discountedTotal = total * 0.9; // 10% discount
            $('#total').text(discountedTotal.toFixed(2) + ' ₪');
            alert('Coupon applied successfully!');
        } else {
            alert('Invalid coupon code!');
        }
    });

    // Update session storage
    function updateSessionStorage() {
        var cartItems = [];
        $('tbody tr').each(function () {
            var item = {
                name: $(this).find('td:nth-child(2) p').text(),
                price: parseFloat($(this).find('td:nth-child(3) p').text().replace('₪', '')),
                quantity: parseFloat($(this).find('input').val())
            };
            cartItems.push(item);
        });
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Load cart items from session storage
    function loadCartItems() {
        var cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
        if (cartItems) {
            $('tbody').empty();
            cartItems.forEach(item => {
                var itemTotal = item.price * item.quantity;
                $('tbody').append(`
                    <tr>
                        <th scope="row">
                            <div class="d-flex align-items-center">
                                <img src="images/product-1-270x264.jpg" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">
                            </div>
                        </th>
                        <td>
                            <p class="mb-0 mt-4">${item.name}</p>
                        </td>
                        <td>
                            <p class="mb-0 mt-4">${item.price.toFixed(2)} ₪</p>
                        </td>
                        <td>
                            <div class="input-group quantity mt-4" style="width: 100px;">
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-minus rounded-circle bg-light border" >
                                    <i class="fa fa-minus"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control form-control-sm text-center border-0" value="${item.quantity}">
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-plus rounded-circle bg-light border">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td>
                            <p class="mb-0 mt-4">${itemTotal.toFixed(2)} ₪</p>
                        </td>
                        <td>
                            <button class="btn btn-md rounded-circle bg-light border mt-4 btn-times" >
                                <i class="fa fa-times text-danger"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
            updateTotal();
            bindQuantityButtons();
            bindRemoveButtons();
        }
    }

    // Initial load of cart items
    loadCartItems();

    // Handle form submission to backend
    $('#proceed-to-checkout').on('click', function () {
        var cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
        if (cartItems) {
            axios.post('https://your-backend-url/api/checkout', {
                items: cartItems
            }, {
                withCredentials: true // Include cookies in the request
            })
            .then(response => {
                alert("Order placed successfully!");
                console.log(response.data);
                sessionStorage.removeItem('cartItems');
            })
            .catch(error => {
                console.error("There was an error placing the order!", error);
                alert("There was an error placing your order. Please try again.");
            });
        }
    });

})(jQuery);
