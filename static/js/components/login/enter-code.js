import { formatTime, init100vh } from "../../utils.js";

$(document).ready(function () {
    init100vh();
    const beginSendTime = 60;
    let sendTime = beginSendTime;
    $('#phone-number').text(localStorage.getItem('reset_password_phone'));

    startTimer(sendTime);

    $('.login__link-send').click(() => {
        sendTime = beginSendTime;
        startTimer(sendTime);
        $('.login__send-again').removeClass('login__send-again_active');
    });

    $('.login__input-code').each(function () {
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
            $(this).addClass('login__input-code_active');
        });

        $('input', this).on('focusout', () => {
            if (!$('input', this).val().length) $(this).removeClass('login__input-code_active');
        });

        $('input', this).on('input', (e) => {
            if (e.originalEvent.data === null) return;

            const value = +e.originalEvent.data;
            const number = $('input', this).attr('id').replace('input-code-', '');
            $('input', this).val(value);

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

    $('#login-enter-code-form').submit((e) => {
        e.preventDefault()
        window.location.href = "new-password.html";
    })
});

function startTimer (time) {
    $('#send-time').text(formatTime(time));
    const sendTimeInterval = setInterval(() => {
        if (time > 0) {
            time -= 1;
            $('#send-time').text(formatTime(time));
        } else {
            $('#send-time').text('');
            $('.login__send-again').addClass('login__send-again_active');
            clearInterval(sendTimeInterval);
        }
    }, 1000);
}
