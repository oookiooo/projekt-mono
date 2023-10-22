const data = [];

const generateId = (function() {
    let id = 0;
    return function() {
        return id++;
    };
})();

const findById = (id, list) => list.find(item => item.id === id);
const removeById = (id, list) => list.filter(item => item.id !== id);
const create = (item) => {
    const newItem = { ...item, id: generateId() };
    data.push(newItem);
    return newItem;
};

const read = (id) => findById(id, data);

const update = (id, updatedItem) => {
    const item = findById(id, data);
    if (item) {
        Object.assign(item, updatedItem);
        return item;
    }
    return null;
};

const del = (id) => {
    const item = findById(id, data);
    if (item) {
        const index = data.indexOf(item);
        data.splice(index, 1);
        return true;
    }
    return false;
};
const findAll = () => [...data];

// 2. Filtruj elementy na podstawie funkcji filtrującej
const filterBy = (predicate) => data.filter(predicate);

// 3. Aktualizuj elementy na podstawie funkcji filtrującej
const updateBy = (predicate, updatedData) => {
    data.forEach((item, index) => {
        if (predicate(item)) {
            Object.assign(data[index], updatedData);
        }
    });
};
const archivedData = [];

// 1. Sortuj dane
const sortBy = (key, order = 'asc') => {
    const sorted = [...data].sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
    return sorted;
};

// 2. Grupuj dane
const groupBy = (key) => {
    return data.reduce((result, item) => {
        (result[item[key]] = result[item[key]] || []).push(item);
        return result;
    }, {});
};

// 3. Wyszukiwarka
const search = (query, keys = ['name', 'description']) => {
    return data.filter(item =>
        keys.some(key => item[key] && item[key].toLowerCase().includes(query.toLowerCase()))
    );
};

// 4. Zlicz dane
const countBy = (key) => {
    return data.reduce((result, item) => {
        result[item[key]] = (result[item[key]] || 0) + 1;
        return result;
    }, {});
};

// 5. Archiwizuj dane
const archive = (id) => {
    const item = findById(id, data);
    if (item) {
        archivedData.push(item);
        del(id);
    }
};

// 6. Pobierz zarchiwizowane dane
const getArchived = () => [...archivedData];

// 7. Statystyki
const statistics = (keys) => {
    return keys.reduce((result, key) => {
        result[key] = data.reduce((sum, item) => sum + (item[key] || 0), 0);
        return result;
    }, {});
};
function updateItem(id) {
    const item = findById(id);
    const newName = prompt('Enter new name', item.name);
    const newDescription = prompt('Enter new description', item.description);
    if (newName && newDescription) {
        item.name = newName;
        item.description = newDescription;
        refreshItemsList();
    } else {
        alert('Please provide valid name and description');
    }
}

function deleteItem(id) {
    del(id);
    refreshItemsList();
}

function archiveItem(id) {
    archive(id);
    refreshItemsList();
    refreshArchivedList();
}
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const searchInput = document.getElementById('searchQuery');
    const createBtn = document.getElementById('createBtn');
    const searchBtn = document.getElementById('searchBtn');
    const archiveBtn = document.getElementById('archiveBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const itemsList = document.getElementById('itemsList');
    const archivedList = document.getElementById('archivedList');

    let selectedItemId = null;

    createBtn.addEventListener('click', () => {
        if (nameInput.value && descriptionInput.value) {
            const newItem = {
                id: new Date().getTime(), // Simple unique id
                name: nameInput.value,
                description: descriptionInput.value
            };
            
            create(newItem);

            const listItem = document.createElement('li');
            listItem.textContent = `${newItem.name}: ${newItem.description}`;
            listItem.dataset.id = newItem.id;
            listItem.onclick = function() {
                selectedItemId = newItem.id;
            };
            itemsList.appendChild(listItem);

            nameInput.value = '';
            descriptionInput.value = '';
        } else {
            alert('Please fill in both name and description fields.');
        }
    });

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const filteredItems = data.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );

        itemsList.innerHTML = '';
        for (const item of filteredItems) {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name}: ${item.description}`;
            listItem.dataset.id = item.id;
            listItem.onclick = function() {
                selectedItemId = item.id;
            };
            itemsList.appendChild(listItem);
        }
    });

    archiveBtn.addEventListener('click', () => {
        if (selectedItemId) {
            archive(selectedItemId);

            // Refresh both lists
            refreshItemsList();
            refreshArchivedList();
        } else {
            alert('Please select an item to archive.');
        }
    });

    updateBtn.addEventListener('click', () => {
        if (selectedItemId && nameInput.value && descriptionInput.value) {
            const item = findById(selectedItemId);
            item.name = nameInput.value;
            item.description = descriptionInput.value;
            refreshItemsList();

            nameInput.value = '';
            descriptionInput.value = '';
        } else {
            alert('Please select an item and fill in both name and description fields to update.');
        }
    });

    deleteBtn.addEventListener('click', () => {
        if (selectedItemId) {
            del(selectedItemId);
            refreshItemsList();
        } else {
            alert('Please select an item to delete.');
        }
    });

    function refreshItemsList() {
        itemsList.innerHTML = '';
        for (const item of data) {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name}: ${item.description}`;
            listItem.dataset.id = item.id;
            listItem.onclick = function() {
                selectedItemId = item.id;
            };
            itemsList.appendChild(listItem);
        }
    }

    function refreshArchivedList() {
        archivedList.innerHTML = '';
        for (const item of archivedData) {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name}: ${item.description}`;
            archivedList.appendChild(listItem);
        }
    }
});
const listItem = document.createElement('li');

const updateButton = document.createElement('button');
updateButton.textContent = "Update";
updateButton.onclick = function() {
    updateItem(item.id);
};
listItem.appendChild(updateButton);

const deleteButton = document.createElement('button');
deleteButton.textContent = "Delete";
deleteButton.onclick = function() {
    deleteItem(item.id);
};
listItem.appendChild(deleteButton);

const archiveButton = document.createElement('button');
archiveButton.textContent = "Archive";
archiveButton.onclick = function() {
    archiveItem(item.id);
};
listItem.appendChild(archiveButton);

listItem.appendChild(document.createTextNode(`${item.name}: ${item.description}`));
itemsList.appendChild(listItem);