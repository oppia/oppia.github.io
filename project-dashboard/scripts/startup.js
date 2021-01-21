import { open } from './db.js';
import { getPAT, setPAT } from './pat.js';
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

  const pat_input = document.querySelector('#authenticate input');

  pat_input.addEventListener('input', () => {
    pat_input.setCustomValidity(''); // reset message
    pat_input.checkValidity();
  });

  pat_input.addEventListener('invalid', () => {
    pat_input.setCustomValidity('A GitHub Personal Access token is a 40 character hexadecimal string');
  });

  // Handle form submission
  document.querySelector('#authenticate form').addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    await setPAT(pat_input.value);

    // Send graphql query
    queryData(getPAT());

    // Hide prompt
    prompt.classList.remove('show');
    main.classList.remove('blur');
  });
} else {
  // Otherwise send graphql query
  queryData(getPAT());
}
