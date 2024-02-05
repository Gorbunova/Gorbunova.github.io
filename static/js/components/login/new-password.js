import { init100vh } from "../../utils.js";

$(document).ready(function () {
    init100vh();
    $('#password-confirm').on('input', handleInput);
    $('#password-confirm').on('change', handleInput);
});

function handleInput (e) {
    const wrapperEl = $('#password-confirm').parent();
    const errorClass = 'login__password-confirm-error';
    if (e.target.value !== $('#password').val()) {
        if (!wrapperEl.hasClass(errorClass)) wrapperEl.addClass(errorClass);
    } else wrapperEl.removeClass(errorClass);
};
