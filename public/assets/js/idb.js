// create db connection variable
let db;

const request = indexedDB.open('pizza_hunt', 1);

// runs first time app is used to created place to save 'new_pizza' obj
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_pizza', { autoIncrement: true });
};


request.onsuccess = function(event) {
    db = event.target.result;

    if(navigator.online) {
        uploadPizza();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// saves data locally if no internet connection
function saveRecord(record) {
    // open a new temporary db connection with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store for new_pizza
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    
    // add record to your store with add method
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    const pizzaObjectStore = transaction.objectStore('new_pizza');
    
    const getAll = pizzaObjectStore.getAll();

    getAll.onsucess = function() {
        if(getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
}

window.addEventListener('online', uploadPizza);