/**
 * An abstraction layer for IndexedDB.
 * 
 * @module
 */

const name = 'OppiaProjectDashboard';
const version = 1; // long long; incrementing fires onupgradeneeded event
let db = null;

/**
 * Open IndexedDB.
 * 
 * @returns {boolean}
 */
const open = async () => {
  let handle = new Promise((resolve, reject) => {
    let req = indexedDB.open(name, version);
    req.onsuccess = event => resolve(event.target.result);
    req.onupgradeneeded = (event) => {
      let db = event.target.result;

      // Create keystore
      if (!db.objectStoreNames.contains('keystore')) {
        let keystore = db.createObjectStore('keystore', { autoIncrement: true, keyPath: 'name' });
        keystore.createIndex('name', 'name', { unique: true });
      }
    
      // Create datastore
      if (!db.objectStoreNames.contains('datastore')) {
        let datastore = db.createObjectStore('datastore', { autoIncrement: true });
        // TODO: Create indexes
      }

      resolve(db);
    };
    req.onerror = reject;
    req.onblocked = reject;
  });

  db = await handle;
  return true;
};

/**
 * Close IndexedDB.
 * 
 * @returns {boolean}
 */
const close = async () => {
  if (db) {
    await db.close();
    db = null;
  }
  return true
};

/**
 * Write a key into the keystore.
 * 
 * @param {string} name - Name of the key to store (must be unique).
 * @param {CryptoKey} key
 * @returns {boolean}
 */
const setKey = async (name, key) => {
  if (!db) await open();

  let transaction = db.transaction(['keystore'], 'readwrite');
  let objectStore = transaction.objectStore('keystore');
  await objectStore.add({ name, key });
  return true;
};

/**
 * Get a key from the keystore.
 * 
 * @param {string} name
 * @returns {CryptoKey}
 */
const getKey = async (name) => {
  if (!db) await open();

  let key = new Promise((resolve, reject) => {
    let transaction = db.transaction(['keystore'], 'readonly');
    let objectStore = transaction.objectStore('keystore');
    let op = objectStore.get(name);
    op.onsuccess = (event) => resolve(event.target.result);
    op.onerror = reject;
  });

  await key;
  return key;
};

// TODO(55): Write getters and setters for datastore

export { open, close, setKey, getKey };
