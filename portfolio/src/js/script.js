const doc = document;

const hamburger = doc.querySelector('.hamburger'),
      menu = doc.querySelector('.menu'),
      closeElem = doc.querySelector('.menu__close'),
      links = doc.querySelectorAll('.menu__link > a');

hamburger.addEventListener('click',() => {
    menu.classList.add('active');
});

closeElem.addEventListener('click',() => {
    menu.classList.remove('active');
});

const counters = doc.querySelectorAll('.skills__ratings-counter'),
      lines = doc.querySelectorAll('.skills__ratings-line span');

counters.forEach((item, i) => {
    lines[i].style.width = item.innerHTML;
});

links.forEach(link => {
    link.addEventListener('click',() => {
        menu.classList.remove('active');
    });
});