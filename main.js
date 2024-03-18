const searchInput = document.querySelector('.search__input');
const autocompleteList = document.querySelector('.autocompleteList');
const repoList = document.querySelector('.repoList');

let timeout = null;

searchInput.addEventListener('input', function () {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    await searchRepositories(searchInput.value);
  }, 500);
});

async function searchRepositories(query) {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}`
  );
  const data = await response.json();

  autocompleteList.innerHTML = '';

  if (data && data.items) {
    data.items.slice(0, 5).forEach(({ name, owner, stargazers_count }) => {
      const li = document.createElement('li');
      li.textContent = name;
      li.classList.add('autocompleteList__item');

      li.addEventListener('click', () => {
        addRepository(name, owner.login, stargazers_count);
        searchInput.value = '';
      });
      autocompleteList.appendChild(li);
    });
  }
}

function addRepository(name, owner, stars) {
  const li = document.createElement('li');
  li.classList.add('repoList__item');

  const div = document.createElement('div');
  const text__name = createParagraph(`Name: ${name}`);
  const text__owner = createParagraph(`Owner: ${owner}`);
  const text__stars = createParagraph(`Stars: ${stars}`);

  const deleteButton = createDeleteButton(() => {
    repoList.removeChild(li);
  });

  div.appendChild(text__name);
  div.appendChild(text__owner);
  div.appendChild(text__stars);

  li.appendChild(div);
  li.appendChild(deleteButton);

  repoList.appendChild(li);
}

function createParagraph(text) {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  return paragraph;
}

function createDeleteButton(callback) {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn__delete');
  deleteButton.addEventListener('click', callback);
  return deleteButton;
}
