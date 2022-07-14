export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + "s";
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // opens the initial connection
    const request = window.indexedDB.open("shop-shop", 1);

    // create the variables to hold the database, transaction and the object store
    let db, tx, store;

    // checks if the version has changed or if new and creates the three object stores
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // creates the object store for each item and sets a primary key
      // uses the keyPath for _id since it pulls from the mongoDB
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keyPath: "_id" });
    };

    // handle errors
    request.onerror = function(e) {
      console.log("There was an error");
    };

    // for when the db open is successful
    request.onsuccess = function (e) {
      // saves a reference of the database to the db variable
      db = request.result;
      // opens a transaction into storeName (must match an object store name)
      tx = db.transaction(storeName, "readwrite");
      // saves a reference to said object store
      store = tx.objectStore(storeName);

      // error check
      db.onerror = function (e) {
        console.log("error", e);
      };

      // checks the value of the method
      switch (method) {
        case "put":
          store.put(object);
          resolve(object);
          break;
        case "get":
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          store.delete(object._id);
          break;
        default:
          console.log("No Valid method");
          break;
      }
      // when transaction is complete it closes the connection
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
