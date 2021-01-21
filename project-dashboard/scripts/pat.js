import { getKey, setKey } from './db.js';

/**
 * Get Personal Access Token from Local Storage
 * @returns {string}
 */
const getPAT = async () => {
  let ciphertext = localStorage.getItem('PAT');
  if (!ciphertext) throw new Error('No PAT currently stored in local storage');
  
  let iv = localStorage.getItem('iv');
  if (!iv) throw new Error('No IV currently stored in local storage');

  // Ciphertext and IV were stored as strings in local storage
  // Split by comma to convert them back into Uint8Arrays
  ciphertext = Uint8Array.from(ciphertext.split(','));
  iv = Uint8Array.from(iv.split(','));

  // Get the symmetric key and decrypt the ciphertext
  let { key } = await getKey('pat_key');
  let pat = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);

  // Convert plaintext data into a string
  return (new TextDecoder()).decode(pat);
};

/**
 * Set Personal Access Token to Local Storage
 * @param {string} pat - The Personal Access Token entered by user
 */
const setPAT = async (pat) => {
  // Get encryption key
  let key = await getKey('pat_key');

  if (!key) {
    // Create symmetric key for encrypting PAT for local storage
    key = await crypto.subtle.generateKey({
      name: 'AES-GCM',
      length: 256,
    },
    false, // do not allow export
    ['encrypt', 'decrypt']);

    // Save key
    await setKey('pat_key', key);
  } else ({ key } = key);

  // Encode PAT into Uint8Array
  const encoder = new TextEncoder();
  let plaintext = encoder.encode(pat);

  // Generate initialization vector
  let iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt plaintext
  let ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);

  // Save ciphertext and IV to local storage as strings
  localStorage.setItem('PAT', new Uint8Array(ciphertext).toString()); // ciphertext is of type buffer
  localStorage.setItem('iv', iv.toString());
};

export { getPAT, setPAT };
