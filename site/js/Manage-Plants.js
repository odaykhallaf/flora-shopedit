document.addEventListener('DOMContentLoaded', function() {
    // Fetch the list of plants when the page is loaded
    fetchPlants();
    
    // Show the 'Add Plant' modal when the button is clicked
    document.getElementById('addProductBtn').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'block';
    });
});

function fetchPlants() {
    // Send a GET request to fetch the list of plants from the backend
    axios.get('/api/plants')
        .then(response => {
            const plants = response.data;
            // Populate the table with the fetched plants data
            populatePlantsTable(plants);
        })
        .catch(error => console.error(error));
}

function populatePlantsTable(plants) {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';  // Clear existing table rows
    
    // Loop through each plant and create a new row in the table
    plants.forEach((plant, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${plant.serialNo}</td>
            <td id="plant-${plant.id}">${plant.name}</td>
            <td>${plant.scientificName}</td>
            <td>${plant.family}</td>
            <td>${plant.category}</td>
            <td><img src="${plant.image}" alt="${plant.name}" width="50" height="50"></td>
            <td>${plant.description}</td>
            <td><button class="btn red" onclick="deletePlant(${plant.id}, this)">Delete</button></td>
            <td><button class="btn green update-btn" data-id="${plant.id}" onclick="openUpdateModal(${plant.id})">Update</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function deletePlant(id, button) {
    // Confirm the deletion with the user
    if (confirm('Are you sure you want to delete this plant?')) {
        // Send a DELETE request to the backend to delete the plant
        axios.delete('/api/plants/' + id)
            .then(response => {
                // Remove the corresponding row from the table
                const row = button.parentNode.parentNode;
                row.parentNode.removeChild(row);
            })
            .catch(error => console.error(error));
    }
}

function openUpdateModal(id) {
    // Get the plant data from the table row and populate the update modal
    const plant = document.getElementById('plant-' + id).parentElement;
    document.getElementById('updatePlantName').value = plant.querySelector('td:nth-child(2)').textContent;
    document.getElementById('updateScientificName').value = plant.querySelector('td:nth-child(3)').textContent;
    document.getElementById('updateFamily').value = plant.querySelector('td:nth-child(4)').textContent;
    document.getElementById('updatePlantCategory').value = plant.querySelector('td:nth-child(5)').textContent;
    document.getElementById('updatePlantDescription').value = plant.querySelector('td:nth-child(7)').textContent;
    
    // Show the update modal
    document.getElementById('update-modal').style.display = 'block';
    document.getElementById('update-modal').setAttribute('data-active-id', id);
}

function closeModal() {
    // Hide the add plant modal
    document.getElementById('modal').style.display = 'none';
}

function closeUpdateModal() {
    // Hide the update plant modal
    document.getElementById('update-modal').style.display = 'none';
}

function addPlant() {
    // Create a new plant object from the input values
    const plant = {
        name: document.getElementById('newPlantName').value,
        scientificName: document.getElementById('newScientificName').value,
        family: document.getElementById('newFamily').value,
        category: document.getElementById('newPlantCategory').value,
        image: document.getElementById('newPlantImage').files[0],
        description: document.getElementById('newPlantDescription').value,
    };

    // Create a FormData object to send the plant data, including the image file
    const formData = new FormData();
    for (const key in plant) {
        formData.append(key, plant[key]);
    }

    // Send a POST request to the backend to add the new plant
    axios.post('/api/plants', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            // Refresh the table to show the new plant
            fetchPlants();
            // Hide the add plant modal
            closeModal();
        })
        .catch(error => console.error(error));
}

function saveChanges() {
    // Get the ID of the plant being updated
    const activeId = document.getElementById('update-modal').getAttribute('data-active-id');
    
    // Create an updated plant object from the input values
    const plant = {
        name: document.getElementById('updatePlantName').value,
        scientificName: document.getElementById('updateScientificName').value,
        family: document.getElementById('updateFamily').value,
        category: document.getElementById('updatePlantCategory').value,
        image: document.getElementById('updatePlantImage').files[0],
        description: document.getElementById('updatePlantDescription').value,
    };

    // Create a FormData object to send the updated plant data, including the image file
    const formData = new FormData();
    for (const key in plant) {
        formData.append(key, plant[key]);
    }

    // Send a PUT request to the backend to update the plant
    axios.put('/api/plants/' + activeId, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            // Refresh the table to show the updated plant
            fetchPlants();
            // Hide the update plant modal
            closeUpdateModal();
        })
        .catch(error => console.error(error));
}
