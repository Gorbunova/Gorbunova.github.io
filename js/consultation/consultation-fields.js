export default class ConsultationFields {
    constructor(btn) {
        this.btn = btn;

        const phonemask = '+7 (___) ___-__-__';
        const startInputPosition = 4;

        let phoneVal = phonemask;
        let inputPos = startInputPosition;

        const fields = btn.parentElement.querySelectorAll('.form__field');
        fields.forEach(field => {
            field.addEventListener('click', () => field.querySelector('input')?.focus());

            if (field.querySelector('input')) field.querySelector('input').value = '';
            else if (field.querySelector('textarea')) field.querySelector('textarea').value = '';
            field.classList.remove('error');
        });

        const inputActive = (e, input, isClick = false) => {
            e.preventDefault();

            const isEmpty = phoneVal === phonemask;
            inputPos = isEmpty ? startInputPosition : getpos(input);

            if (input.value === '') {
                input.value = phonemask;
                input.setSelectionRange(inputPos, inputPos);
            } else {
                inputPos = input.value.indexOf('_', isClick ? inputPos : undefined);
                input.setSelectionRange(inputPos, inputPos);
            }
        }

        const inputPhone = btn.parentElement.querySelectorAll('.form__input-phone');
        inputPhone.forEach(input => {
            input.addEventListener('focus', (e) => inputActive(e, input));
            input.addEventListener('click', (e) => inputActive(e, input, true));

            input.addEventListener('focusout', () => {
                if (input.value === phonemask) input.value = '';
            });

            input.addEventListener('input', (e) => {
                if (e.data === null) changePhone(input, 'delete');
                else changePhone(input, 'input', e.data);
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();

                const clipboardData = e.clipboardData || window.clipboardData;
                const pastedData = clipboardData.getData('Text');

                changePhone(input, 'paste', pastedData.replace(/[^\d]/g, ''));
            });
        })

        const changePhone = (input, action, data) => {
            switch (action) {
                case 'paste': {
                    for (let i = 0; i < data.length; i++) {
                        processPhoneValue(data[i]);
                    }

                    break;
                }
                case 'delete': {
                    const lastNumberPosition = lastIndexOfByRegexp(phoneVal, /\d/g);

                    if (lastNumberPosition !== null && lastNumberPosition > 2) {
                        phoneVal = setCharAt(phoneVal, lastNumberPosition, '_');
                        inputPos = lastNumberPosition;
                    }

                    break;
                }
                case 'input': {
                    processPhoneValue(data);
                    break;
                }
            }

            input.value = phoneVal;
            input.setSelectionRange(inputPos, inputPos);
        }

        const processPhoneValue = (value) => {
            if (value.match(/\d/g)) {
                const nextNumberPos = phoneVal.indexOf('_', inputPos);
                const nextPos = nextNumberPos > 0 ? nextNumberPos : phonemask.length;
                inputPos = nextPos + 1;
                phoneVal = setCharAt(phoneVal, nextPos, value);
            }
        }
    }
}

const getpos = (el) => {
    let pos, sel;

    // Internet Explorer
    if (document.selection) {
        el.focus();
        if (sel=document.selection.createRange()) {
            sel.moveStart('character', -el.value.length);
            pos = sel.text.length;
        } else pos = 0;
    }
    // Mozilla, Chrome
    else if (el.selectionStart || el.selectionStart == '0') {
        if (el.selectionDirection) {
            if (el.selectionDirection == 'backward') {
                pos = el.selectionStart;
            } else pos = el.selectionEnd;
        } else pos = el.selectionEnd;
    } else pos = 0;

    return parseInt(pos);
}

const setCharAt = (str, index, chr) => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

const lastIndexOfByRegexp = (str, regexp) => {
    for (let i = str.length; i >= 0; i--) {
        const substr = str.substring(0, i);
        if (substr[i - 1].match(regexp)) return i - 1;
    }

    return null;
}
