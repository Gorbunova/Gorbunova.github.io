export function createSelectField (content, field, isFieldDisabled) {
    if (field.name) {
        content.innerHTML = content.innerHTML + `
            <div class="chapter-field__wrapper select">
                <label for=${field.name}>${field.label}</label>
                <div class="chapter-field__select-wrapper">
                    <select ${isFieldDisabled ? 'disabled' : ''} id="${field.name}" class="chapter-field__select chapter-field">
                        <option disabled selected value>не выбрано</option>
                        ${getOptions(field.options, field.name)}
                    </select>
                </div
            </div>
        `
    }
}

function getOptions(options, fieldName) {
    const dataObj = JSON.parse(localStorage.getItem('questionnaire_data')) ?? {};
    const value = dataObj[fieldName];
    return options.map(option => `<option ${option === value ? 'selected' : ''}>${option}</option>`).join('');
}