let db;

const request = indexedDB.open("budgettrack", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    if(navigator.onLine) {
        checkDB();
    }
};

// shows what the error is if there is an error

request.onerror = function(event) {
    console.log("OOPS!" + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["Pending Charge"], "readwrite");
    const store = transaction.objectStore("Pending Charge");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        console.log(getAll.result)
        if (getAll.result.length > 0) {
            console.log(getAll.result),
         fetch("/api/transaction/bulk", {
            method: "post",
            body: JSON.stringify(getAll.result),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }  
         })
         .then(response => response.json())
          .then(() => {
              const transaction = db.transaction(["Pending Charge"], "readwrite");
              const store = transaction.objectStore("Pending Charge");
              store.clear();
          });
        }  
    };
}

// app coming back online

window.addEventListener("online", checkDatabase);