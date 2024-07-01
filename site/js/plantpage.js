document.addEventListener('DOMContentLoaded', function() {
    const plantId = getPlantIdFromUrl();
    fetchPlantDetails(plantId);
    setupModal();
});

function getPlantIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('plantId');
}

function fetchPlantDetails(plantId) {
    fetch(`api/plants/${plantId}`) 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayPlantDetails(data);
    })
    .catch(error => {
        console.error('Error fetching plant details:', error);
        displayAlert('Failed to load plant details. Please try again later.', 'error');
    });
}

function displayPlantDetails(plant) {
    document.querySelector('.single-product h3').textContent = plant.name;
    document.querySelector('.single-product .big').textContent = plant.description;
    document.querySelector('.single-product img').src = plant.imageUrl;

    const carousel = document.querySelector('#child-carousel');
    carousel.innerHTML = ''; 
    plant.images.forEach(img => {
        const imgElement = `<div class="item">
            <div class="slick-slide-overlay"><img src="${img}" alt="${plant.name}" width="117" height="108" loading="lazy"/>
            </div>
        </div>`;
        carousel.insertAdjacentHTML('beforeend', imgElement);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupModal();
});

function setupModal() {
    const images = document.querySelectorAll('.slick-slide-overlay img');
    images.forEach(image => {
        image.addEventListener('click', () => openModal(image.src));
    });
}

function openModal(imgSrc) {
    const modalHtml = `
        <div class="modal" onclick="closeModal(event)">
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="${imgSrc}" alt="Plant Image" style="width:100%">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.querySelector('.modal').style.display = 'block';
}

function closeModal(event) {
    if (event.target.className.includes('close') || event.target.classList.contains('modal')) {
        document.querySelector('.modal').remove();
    }
}
