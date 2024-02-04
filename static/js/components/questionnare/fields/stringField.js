export function createStringField (content, field, isFieldDisabled) {
    if (field.name) {
        const dataObj = JSON.parse(localStorage.getItem('questionnaire_data')) ?? {};
        const value = dataObj[field.name];
        content.innerHTML = content.innerHTML + `
            <div class="chapter-field__wrapper string">
                <label for=${field.name}>${field.label}</label>
                <div class="chapter-field__input">
                    <textarea ${isFieldDisabled ? 'disabled' : ''} class="chapter-field" id="${field.name}">${value ?? ''}</textarea>
                </div>
            </div>
        `;
    }
}
