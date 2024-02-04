import { createChapter } from './components/questionnare/chapter.js';
import OfferBlock from './components/questionnare/offer-block.js';
import questionnaire from './questionnaire.json'  assert { type: 'json' };

$(document).ready(function () {
    let activeChapter = 0;
    const chapters = questionnaire.chapters

    if (localStorage.getItem('questionnaire_state') === 'filling') {
        $('#questionnaire-send').css('display', 'block');
        fillMenu();
    } else if (localStorage.getItem('questionnaire_state') === 'consideration') {
        fillMenu();
        $('.questionnaire__label').html('Рассмотрение анкеты');
        $('.questionnaire__label').addClass('label__blue');
        $('.questionnaire__title').html('Компания «Терралинк» проверяет Вашу анкету. В течение нескольких дней мы с Вами свяжемся');
    } else if (localStorage.getItem('questionnaire_state') === 'accepted') {
        fillMenu();
        $('.questionnaire__label').html('Анкета проверена');
        $('.questionnaire__label').addClass('label__green');
        $('.questionnaire__title').html('Компания «Терралинк» рассмотрела Вашу анкету и приняла положительное решение. Пожалуйста, ознакомьстесь с оффером');
        new OfferBlock($('.offer__block')[0])
    } else {
        $('.questionnaire-block__content').html(`
            <img src="../static/assets/images/questionnaire_image.png" alt="questionnaire image">
            <p class="questionnaire-block__info">Заполните, пожалуйста,<br> информацию о себе</p>
            <button class="custom-button" id="questionnaire-fill">Заполнить анкету</button>
        `);
    }

    $('#questionnaire-fill').click(() => {
        $('.questionnaire__form').css('display', 'grid');
        localStorage.setItem('questionnaire_state', 'filling');
        fillMenu();
    })

    $('#questionnaire-send').click(() => {
        considerationSet()
    })

    chapters.forEach((_val, idx) => {
        $('.questionnaire-form__chapters-wrapper').append(`<div class="questionnaire-form__chapter" id="chapter-${idx}"></div>`);
    })
    updateChapter(activeChapter);

    $('#questionnaire-next').click(() => {
        if (activeChapter < chapters.length - 1) updateChapter(++activeChapter);
        else {
            considerationSet();
        }
    })

    $('.questionnaire-form__chapter').click(function () {
        activeChapter = $(this).attr('id').replace('chapter-', '');
        updateChapter(activeChapter);
    })

    $('.questionnaire__message button').click(() => {
        $('.questionnaire__message').removeClass('active');
    })

    function updateChapter (idx) {
        createChapter($('.questionnaire-form__content'), idx, chapters[idx]);
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
            $('.questionnaire__form').css('display', 'grid');
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

        localStorage.setItem('questionnaire_state', 'consideration');

        $('.questionnaire__form').css('display', 'none');
        $('#questionnaire-send').css('display', 'none');
        $('.questionnaire__label').html('Рассмотрение анкеты');
        $('.questionnaire__label').removeClass('label__black');
        $('.questionnaire__label').addClass('label__blue');
        $('.questionnaire__title').html('Компания «Терралинк» проверяет Вашу анкету. В течение нескольких дней мы с Вами свяжемся')
    }

    function compareArrays (arr1, arr2) {
        let el = null;
        for (let index = 0; index < arr1.length; index++) {
            const arr2index = arr2.findIndex((el) => el === arr1[index]);
            const dataObj = JSON.parse(localStorage.getItem('questionnaire_data')) ?? {};
            if (arr2index === -1 || !dataObj[arr2[arr2index]].length) {
                return arr1[index];
            }
        }
        return el;
    }
})
