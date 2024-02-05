import { init100vh } from "../../utils.js";

$(document).ready(function () {
    init100vh();
    $('.login__input').on('input', handleInput);

    $('.login__link').click(function () {
        if ($('#phone').val().length === 13) {
            localStorage.setItem('reset_password_phone', '+7 ' + $('.login__input').val() ?? '');
            window.location.href = "enter-code.html";
        } else $('#phone').parent().addClass('error');
    })
});

function handleInput (e) {
    if (e.target.id !== 'phone') return;
    if ($('#phone').parent().hasClass('error')) $('#phone').parent().removeClass('error');
    e.target.value = phoneMask(e.target.value);
};

function phoneMask (phone) {
    return phone.replace(/\D/g, '')
        .replace(/(\d{3})(\d{3})/, '$1 $2')
        .replace(/( \d{3})(\d{3})/, '$1 $2')
        .replace(/( \d{2})(\d{2})$/, '$1 $2');
};
