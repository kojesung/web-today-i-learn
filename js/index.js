const tilForm = document.querySelector('#til-form');
const tilList = document.querySelector('#til-list');

tilForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const date = document.querySelector('#til-date').value;
    const title = document.querySelector('#til-title').value;
    const content = document.querySelector('#til-content').value;

    const article = document.createElement('article');
    article.className = 'til-item';

    const timeEl = document.createElement('time');
    timeEl.textContent = date;

    const h3El = document.createElement('h3');
    h3El.textContent = title;

    const pEl = document.createElement('p');
    pEl.textContent = content;

    article.append(timeEl, h3El, pEl);
    tilList.prepend(article);
    tilForm.reset();
});
