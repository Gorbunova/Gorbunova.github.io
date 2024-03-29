import { createStringField } from "./fields/stringField.js";
import { createBooleanField } from "./fields/booleanField.js";
import { createSelectField } from "./fields/selectField.js";

export function createChapter (content, idx, chapterObj, isDisabled) {
    $('.questionnaire-form__chapter').each(function () {
        $(this).removeClass('active');
    });
    $(`#chapter-${idx}`).addClass('active');

    content.empty();
    const container = document.createElement('div');
    container.classList.add('chapter');
    container.innerHTML = `
        <h2 class="chapter__title">${chapterObj.title}</h2>
    `
    if (chapterObj.subtitle) {
        container.innerHTML = container.innerHTML + `
            <h3 class="chapter__subtitle">${chapterObj.subtitle}</h3>
        `
    }

    chapterObj.fields?.forEach((field) => {
        switch (field.type) {
            case 'string': {
                if (field.options) createSelectField(container, field, isDisabled);
                else createStringField(container, field, isDisabled);
                break;
            }
            case 'boolean': {
                createBooleanField(container, field, isDisabled);
                break;
            }
        }
    })
    content.append(container);

    $(`.chapter-field`).on('change', function (e) {
        const dataObj = JSON.parse(localStorage.getItem('questionnaire_data')) ?? {};
        dataObj[$(this).attr('id')] = e.target.value === 'on' ? e.target.checked : e.target.value;
        localStorage.setItem('questionnaire_data', JSON.stringify(dataObj));
    })

}
