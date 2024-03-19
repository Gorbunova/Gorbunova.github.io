import { hideModal } from "../script.js";

export default class ConsultationBtn {
    constructor(btn) {
        this.btn = btn;

        const emailRegexp = /^\S+@\S+\.\S+$/;

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
                const plane = btn.closest('.consultation__wrapper')?.querySelector('.consultation__img');

                if (!plane) {
                    /* const token = document.querySelector('#captcha-container input')?.value;

                    if (token) check_captcha(token, (passed) => {
                        if (passed) {*/
                            hideModal();
                    /*  }
                     }); */
                }
                else {
                    const transform = window.innerWidth > 992 ? 'translate(-364px, -200px) scale(0.5)' : 'translate(-182px, -100px) scale(0.5)'
                    plane.style.transform = transform;

                    setTimeout(() => plane.style.opacity = '0', 350);
                    setTimeout(() => {
                        btn.closest('.consultation__wrapper').innerHTML = `
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
    }
}

async function check_captcha(token, callback) {
    const SMARTCAPTCHA_SERVER_KEY = "###";

    await fetch(`https://smartcaptcha.yandexcloud.net/validate?secret=${SMARTCAPTCHA_SERVER_KEY}&token=${token}`)
        .then((res) => {
            if (res.status !== 200) {
                callback(false);
                return;
            }
            callback(res.ok);
        })
}
