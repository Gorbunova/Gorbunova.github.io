import { createChapter } from './chapter.js';
import OfferBlock from './offer-block.js';
import { init100vh, hideElement, compareArrays, showElement } from '../../utils.js';

export const questionnaireStates = {
    FILLING: 'filling',
    CONSIDERATION: 'consideration',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
};

export async function initQuestionnaire (state) {
    init100vh();
    let activeChapter = 0;
    const questionnaire = await fetchJSONData();

    let isDisabledFields = state === questionnaireStates.REJECTED
    || state === questionnaireStates.ACCEPTED
    || state === questionnaireStates.CONSIDERATION;

    const chapters = questionnaire.chapters;

    if (state) fillMenu();

    if (!state) {
        $('.questionnaire-block__content').html(`
            <img src="../static/assets/images/questionnaire_image.png" alt="questionnaire image">
            <p class="questionnaire-block__info">Заполните, пожалуйста,<br> информацию о себе</p>
            <button class="custom-button" id="questionnaire-fill">Заполнить анкету</button>
        `);
    } else if (state === questionnaireStates.ACCEPTED) {
        new OfferBlock($('.offer__block')[0]);
    } else if (state === questionnaireStates.FILLING) {
        showElement($('#questionnaire-send'));
    } else if (state === questionnaireStates.CONSIDERATION) {
        $('.questionnaire__label').html('Рассмотрение анкеты');
        $('.questionnaire__label').addClass('label__blue');
        $('.questionnaire__title').html('Компания «Терралинк» проверяет Вашу анкету. В течение нескольких дней мы с Вами свяжемся');
        hideElement($('.questionnaire-form__footer'));
    }

    chapters.forEach((_val, idx) => {
        $('.questionnaire-form__chapters-wrapper').append(`<div class="questionnaire-form__chapter" id="chapter-${idx}"></div>`);
    })
    updateChapter(activeChapter);

    $('#questionnaire-fill').click(() => {
        showElement($('.questionnaire__form'), 'grid');
        showElement($('#questionnaire-send'));
        localStorage.setItem('questionnaire_state', questionnaireStates.FILLING);
        fillMenu();
    })

    $('#questionnaire-send').click(() => considerationSet());

    $('#questionnaire-next').click(() => {
        if (activeChapter < chapters.length - 1) updateChapter(++activeChapter);
        else considerationSet();
    })

    $('.questionnaire-form__chapter').click(function () {
        activeChapter = $(this).attr('id').replace('chapter-', '');
        updateChapter(activeChapter);
    })

    $('.questionnaire__message button').click(() => $('.questionnaire__message').removeClass('active'))

    $('#back-link').click(() => hideElement($('.questionnaire__form')));

    function updateChapter (idx) {
        createChapter($('.questionnaire-form__content'), idx, chapters[idx], isDisabledFields);
    }

    function fillMenu () {
        const names = chapters.map(chapter => chapter.name);
        let content = '';

        names.forEach((name, idx) => {
            content += `
                <div class="questionnaire-chapter__menu-item" id="menu-item-${idx}">
                    <div>${name}</div>
                    <img src="../static/assets/icons/right-arrow-thin.svg" alt="menu item icon">
                </div>
            `
        });

        $('.questionnaire-block__content').html(content);

        $('.questionnaire-chapter__menu-item').click(function () {
            activeChapter = $(this).attr('id').replace('menu-item-', '');
            updateChapter(activeChapter);
            showElement($('.questionnaire__form'), 'grid');
        })
    }

    function considerationSet () {
        const requiredValues = [];
        chapters.forEach(chapter => {
            const requiredElements = chapter.fields?.filter(chapter => chapter.required).map(chapter => chapter.name);
            if (requiredElements?.length) requiredValues.push(...requiredElements);
        })
        const dataObj = JSON.parse(localStorage.getItem('questionnaire_data')) ?? {};

        if (compareArrays(requiredValues, Object.keys(dataObj))) {
            $('.questionnaire__message').addClass('active');
            return;
        }

        localStorage.setItem('questionnaire_state', questionnaireStates.CONSIDERATION);
        isDisabledFields = true;
        hideElement($('.questionnaire-form__footer'));

        hideElement($('.questionnaire__form'));
        hideElement($('#questionnaire-send'));
        $('.questionnaire__label').html('Рассмотрение анкеты');
        $('.questionnaire__label').removeClass('label__black');
        $('.questionnaire__label').addClass('label__blue');
        $('.questionnaire__title').html('Компания «Терралинк» проверяет Вашу анкету. В течение нескольких дней мы с Вами свяжемся')
    }
}

function fetchJSONData() {
    return fetch("../static/js/questionnaire.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .catch((error) =>
               console.error("Unable to fetch data:", error));
}
