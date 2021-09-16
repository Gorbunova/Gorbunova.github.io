const doc = document;

const hamburger = doc.querySelector('.hamburger'),
      menu = doc.querySelector('.menu'),
      closeElem = doc.querySelector('.menu__close');

hamburger.addEventListener('click',() => {
    menu.classList.add('active');
});

closeElem.addEventListener('click',() => {
    menu.classList.remove('active');
});
