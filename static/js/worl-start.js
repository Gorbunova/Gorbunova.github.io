import { init100vh } from "./utils.js";

$(document).ready(function () {
    init100vh();
    $('.work-start__input').each(function () {

        $('#copy-field', this).click(() => {
            const val = ($('input', this).val());
            if (val) navigator.clipboard.writeText(val);
        })

        $('#show-password', this).click(() => {
            const type = $('input', this).attr('type');
            if (type === 'password') $('input', this).attr('type', 'text');
            else $('input', this).attr('type', 'password');
        })
    });
})
