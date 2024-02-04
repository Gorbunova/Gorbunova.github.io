export function createBooleanField (content, field, isFieldDisabled) {
    if (field.name) {
        const dataObj = JSON.parse(localStorage.getItem('questionnaire_data')) ?? {};
        const value = dataObj[field.name];
        content.innerHTML = content.innerHTML + `
            <div class="chapter-field__wrapper boolean">
                <label class="chapter-field__checkbox">
                    ${field.label}
                    <input ${isFieldDisabled ? 'disabled' : ''} id="${field.name}" class="chapter-field" type="checkbox" ${value ? "checked" : ""}>
                    <span class="chapter-field__checkmark"></span>
                </label>
            </div>
        `
    }
}