import { showModal } from './script.js';
import { initConsultation } from './consultation/index.js';

document.addEventListener('DOMContentLoaded', function() {
    initConsultation();
    initReviewAccordeon();
    initFaqAccordeon();

    document.querySelector('.portal__button')?.addEventListener('click', showModal);
    document.querySelector('.portal-problems__button')?.addEventListener('click', showModal);
})

const initReviewAccordeon = () => {
    document.querySelectorAll('.portal-review__item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;
            document.querySelectorAll('.portal-review__item').forEach(item => item.classList.remove('active'));
            item.classList.add('active');
        })
    })
};

const initFaqAccordeon = () => {
    document.querySelectorAll('.portal-faq__item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;
            document.querySelectorAll('.portal-faq__item').forEach(item => item.classList.remove('active'));
            item.classList.add('active');
        })
    })
};
