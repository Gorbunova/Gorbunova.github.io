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
                <div class="offer__btn-wrapper">
                    <button class="custom-button transparent" id="read-btn">Ознакомиться</button>
                </div>
                <img class="offer__img" src="../static/assets/images/offer.png"" alt="offer image"/>
            </div>
            <div class="offer-code__wrapper hidden">
                <h3>Введите код</h3>
                <p>Был направлен Вам в сообщении <br> на номер <span id="phone-number"></span></p>
                <div class="offer__input-code-wrapper">
                    <div class="offer__input-code">
                        <input id="input-code-1" type="tel">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-2"  type="tel">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-3" type="tel">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-4" type="tel">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-5" type="tel">
                    </div>
                    <div class="offer__input-code">
                        <input id="input-code-6" type="tel">
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
        let timer = null;

        $('#read-btn').click(() => {
            $('.offer__inner').addClass('hidden');
            $('.offer-code__wrapper').removeClass('hidden');
            clearInterval(timer);
            timer = startTimer(sendTime);
        })

        $('#code-cancel-btn').click(() => {
            $('.offer__inner').removeClass('hidden');
            $('.offer-code__wrapper').addClass('hidden');
            $('.offer__input-code').each(function () {
                $(this).removeClass('offer__input-code_active');
                $('input', this).val('');
            })
        })

        const beginSendTime = 10;
        let sendTime = beginSendTime;

        $('#phone-number').text(localStorage.getItem('reset_password_phone'));


        $('.offer__link-send').click(() => {
            sendTime = beginSendTime;
            timer = startTimer(sendTime);
            $('.offer__send-again').removeClass('offer__send-again_active');
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

                if (+number === 6) {
                    $('.offer__inner').removeClass('hidden');
                    $('.offer-code__wrapper').addClass('hidden');
                    $('.offer__btn-wrapper').html(`
                        <button class="custom-button transparent" id="accept-btn">Принять</button>
                        <button class="custom-button transparent" id="reject-btn">Отклонить</button>
                    `);
                    $('.questionnaire__title').text('Вы можете принять или отклонить оффер. Будем рады видеть Вас в числе наших сотрудников!');
                    $('#accept-btn').click(() => {
                        window.location.href = 'work-start.html'
                    })
            
                    $('#reject-btn').click(() => {
                        console.log('!')
                        window.location.href = 'questionnaire-rejected.html'
                    })
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
            $('.offer__send-again').addClass('offer__send-again_active');
            clearInterval(sendTimeInterval);
        }
    }, 1000);
    return sendTimeInterval;
}
