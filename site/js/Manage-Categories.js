// Execute this code after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fetch categories from the server when the page loads
    fetchCategories();

    // Display the modal for adding a new category when the "Add Category" button is clicked
    document.getElementById('addCategoryBtn').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'block';
    });
});

// Function to fetch categories from the API and display them in the table
function fetchCategories() {
    axios.get('/api/categories')
        .then(response => {
            const categories = response.data;
            populateCategoriesTable(categories);
        })
        .catch(error => console.error(error));
}

// Function to populate the categories table with data from the API
function populateCategoriesTable(categories) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    categories.forEach((category, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td id="category-${category.id}">${category.name}</td>
            <td><button class="btn red" onclick="deleteCategory(${category.id}, this)">Delete</button></td>
            <td><button class="btn green update-btn" data-id="${category.id}" onclick="openUpdateModal(${category.id})">Update</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to delete a category
function deleteCategory(id, button) {
    if (confirm('Are you sure you want to delete this category?')) {
        axios.delete('/api/categories/' + id)
            .then(response => {
                const row = button.parentNode.parentNode;
                row.parentNode.removeChild(row); // Remove the row from the table
            })
            .catch(error => console.error(error));
    }
}

// Function to open the update modal with the current category data
function openUpdateModal(id) {
    const categoryName = document.getElementById('category-' + id).textContent;
    document.getElementById('update-input').value = categoryName;
    document.getElementById('update-modal').style.display = 'block';
    document.getElementById('update-modal').setAttribute('data-active-id', id);
}

// Function to close the add category modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Function to close the update category modal
function closeUpdateModal() {
    document.getElementById('update-modal').style.display = 'none';
}

// Function to add a new category
function addCategory() {
    const categoryName = document.getElementById('newCategoryName').value;
    axios.post('/api/categories', { name: categoryName })
        .then(response => {
            fetchCategories(); // Refresh the table with the updated list of categories
            closeModal();      // Close the add category modal
        })
        .catch(error => console.error(error));
}

// Function to save changes to an existing category
function saveChanges() {
    const activeId = document.getElementById('update-modal').getAttribute('data-active-id');
    const newName = document.getElementById('update-input').value;
    axios.put('/api/categories/' + activeId, { name: newName })
        .then(response => {
            document.getElementById('category-' + activeId).textContent = newName;
            closeUpdateModal(); // Close the update category modal
        })
        .catch(error => console.error(error));
}
