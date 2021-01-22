import { open } from './db.js';
import { getPat, setPat } from './pat.js';
import queryData from './graphql.js';

// Open Database
open();

// If the Personal Access Token is not in local storage, prompt user for one
if (!localStorage.getItem('PAT')) {
  // Show the authenticate form and bind validation functions
  const prompt = document.querySelector('#authenticate');
  const main = document.querySelector('main');
  prompt.classList.add('show');
  main.classList.add('blur');

  const patInput = document.querySelector('#authenticate input');

  patInput.addEventListener('input', () => {
    patInput.setCustomValidity(''); // reset message
    patInput.checkValidity();
  });

  patInput.addEventListener('invalid', () => {
    patInput.setCustomValidity('A GitHub Personal Access token is a 40 character hexadecimal string');
  });

  // Handle form submission
  document.querySelector('#authenticate form').addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    await setPat(patInput.value);

    // Send graphql query
    queryData(getPat());

    // Hide prompt
    prompt.classList.remove('show');
    main.classList.remove('blur');
  });
} else {
  // Otherwise send graphql query
  queryData(getPat());
}
