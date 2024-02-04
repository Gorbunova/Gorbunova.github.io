import { formatTime } from "../../utils.js";

export default class OfferBlock {
    constructor(content) {
        const el = document.createElement('div');
        el.classList.add('offer__wrapper');
        el.innerHTML = `
            <div class="offer__inner">
                <h3>Оффер</h3>
                <p>Уважемый, Иван Иванович, мы рады предложить Вам работу в нашей компании!</p>
                <a>
                    <img src="../static/assets/icons/file.svg" alt="file icon"/>
                    <span>Приглашение на работу.pdf</span>
                </a>
                <button class="custom-button transparent" id="read-btn">Ознакомиться</button>
                <img class="offer__img" src="../static/assets/images/offer.png"" alt="offer image"/>
            </div>
            <div class="offer-code__wrapper hidden">
                <h3>Введите код</h3>
                <p>Был направлен Вам в сообщении <br> на номер <span id="phone-number"></span></p>
                <div class="offer__input-code-wrapper">
                    <div class="offer__input-code">
                        <input id="input-code-1" type="text">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-2"  type="text">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-3" type="text">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-4" type="text">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-5" type="text">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-6" type="text">
                    </div>
                </div>
                <div class="offer__send-again">
                    <div class="offer__link-send">Отправить снова</div>
                    <span id="send-time">00:00</span>
                </div>
                <button id="code-cancel-btn" class="custom-button transparent">Отменить</button>
            </div>
        `

        content.appendChild(el);

        $('#read-btn').click(() => {
            $('.offer__inner').addClass('hidden');
            $('.offer-code__wrapper').removeClass('hidden');
            startTimer(sendTime);
        })

        $('#code-cancel-btn').click(() => {
            $('.offer__inner').removeClass('hidden');
            $('.offer-code__wrapper').addClass('hidden');
        })

        const beginSendTime = 120;
        let sendTime = beginSendTime;

        $('#phone-number').text(localStorage.getItem('reset_password_phone'));


        $('.offer__link-send').click(() => {
            sendTime = beginSendTime;
            startTimer(sendTime);
            $('.offer__link-send').removeClass('offer__link-send_active');
        });

        $('.offer__input-code').each(function () {
            $(this).on('click', () => {
                for (let index = 6; index > 0; index--) {
                    if ($(`#input-code-${index}`).val().length) {
                        if (index === 6) $(`#input-code-${index}`).focus();
                        $(`#input-code-${index + 1}`).focus();
                        break;
                    }
                    if (index === 1) {
                        $(`#input-code-${index}`).focus();
                        break;
                    }
                };
            });

            $('input', this).on('focus', () => {
                $(this).addClass('offer__input-code_active');
            });

            $('input', this).on('focusout', () => {
                if (!$('input', this).val().length) $(this).removeClass('offer__input-code_active');
            });

            $('input', this).on('input', (e) => {
                if (e.originalEvent.data === null) return;

                const value = +e.originalEvent.data;
                const number = $('input', this).attr('id').replace('input-code-', '');

                if (isNaN(value)) {
                    $(`#input-code-${number}`).val('');
                }
                if (value || value === 0) {
                    $(`#input-code-${number}`).val(value);
                    if (+number + 1 <= 6) $(`#input-code-${+number + 1}`).focus();
                }
            });

            $('input', this).on('keyup', (e) => {
                if (e.key !== 'Backspace') return;
                const value = $('input', this).val();
                const number = $('input', this).attr('id').replace('input-code-', '');

                if (!value.length && number > 1) {
                    $(`#input-code-${+number - 1}`).focus();
                } else $(`#input-code-${+number}`).val('');
            });
        })

/*         $('#offer-enter-code-form').submit((e) => {
            e.preventDefault()
            window.location.href = "new-password.html";
        }) */
    }
}

function startTimer (time) {
    $('#send-time').text(formatTime(time));
    const sendTimeInterval = setInterval(() => {
        if (time > 0) {
            time -= 1;
            $('#send-time').text(formatTime(time));
        } else {
            $('#send-time').text('');
            $('.offer__link-send').addClass('offer__link-send_active');
            clearInterval(sendTimeInterval);
        }
    }, 1000);
}
