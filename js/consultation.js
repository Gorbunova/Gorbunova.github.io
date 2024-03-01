import { hideModal } from "./script.js";

export const initConsultation = () => {
    initConsultationBtn();
    initConsultationInputs();
}

export const initConsultationBtn = () => {
    const emailRegexp = /^\S+@\S+\.\S+$/;
    const btns = document.querySelectorAll('.consultation__btn');

    btns.forEach(btn => {
        const inputEmail = btn.parentElement.querySelector('.form__input-email');
        const inputPhone = btn.parentElement.querySelector('.form__input-phone');
        const inputName = btn.parentElement.querySelector('.form__input-name');
        const fields = btn.parentElement.querySelectorAll('.form__field');
        const isModal = btn.parentElement.classList.contains('modal__form');

        if (isModal) btn.removeAttribute('disabled');

        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const isErrorEmail = !inputEmail.value.match(emailRegexp);
            const isErrorPhone = inputPhone.value.replace(/[^\d]/g, '').length < 11;
            const isErrorName = !inputName.value.length;

            if (isErrorEmail || isErrorPhone || isErrorName) {
                if (isErrorEmail) inputEmail.parentElement.classList.add('error');
                if (isErrorPhone) inputPhone.parentElement.classList.add('error');
                if (isErrorName) inputName.parentElement.classList.add('error');
            }
            else {
                const plane = btn.parentElement.parentElement.querySelector('.consultation__img');

                if (!plane) {
                    const token = document.querySelector('#captcha-container input')?.value;

                    if (token) check_captcha(token, (passed) => {
                        if (passed) {
                            hideModal();
                            console.log("Passed");
                        } else {
                            console.log("Robot");
                        }
                    });
                }
                else {
                    const transform = window.innerWidth > 992 ? 'translate(-364px, -200px) scale(0.5)' : 'translate(-182px, -100px) scale(0.5)'
                    plane.style.transform = transform;

                    setTimeout(() => plane.style.opacity = '0', 350);
                    setTimeout(() => {
                        document.querySelector('.consultation__wrapper').innerHTML = `
                            <div class="consultation__sended">
                                <h2>Первый шаг сделан</h2>
                                <p>Скоро наш менеджер свяжется с вам для уточнения деталей</p>
                            </div>
                        `;
                    }, 700);
                }
            }
        })

        fields.forEach(field => field.addEventListener('input', () => {
            if (field.classList.contains('error')) field.classList.remove('error');

            const nameLength = inputName.value.length;
            const phoneLength = inputPhone.value.length;
            const emailLength = inputEmail.value.length;

            if (nameLength && phoneLength && emailLength) btn.removeAttribute('disabled');
            else if (!isModal) btn.setAttribute('disabled', true);
        }))
    });
}

export const initConsultationInputs = () => {
    const phonemask = '+7 (___) ___-__-__';
    const startInputPosition = 4;

    let phoneVal = phonemask;
    let inputPos = startInputPosition;

    const fields = document.querySelectorAll('.form__field');
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

    const inputPhone = document.querySelectorAll('.form__input-phone');
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

async function check_captcha(token, callback) {
    const SMARTCAPTCHA_SERVER_KEY = "ysc2_e8podTmvdwKIyUrSYj7aEbsxZlMLuNuWo384CP5ddfb08edf";
    /* const options = {
        hostname: 'smartcaptcha.yandexcloud.net',
        port: 443,
        path: '/validate?' + querystring.stringify({
            secret: SMARTCAPTCHA_SERVER_KEY,
            token: token,
            ip: '<IP-адрес_пользователя>', // Способ получения IP-адреса пользователя зависит от вашего фреймворка и прокси.
        }),
        method: 'GET',
    }; */
    await fetch(`https://smartcaptcha.yandexcloud.net/validate?secret=${SMARTCAPTCHA_SERVER_KEY}&token=${token}`, {
    })
        .then((res) => {
            if (res.status !== 200) {
                callback(false);
                return;
            }
            callback(res.ok);
        })
}
