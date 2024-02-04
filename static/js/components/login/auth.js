$(document).ready(function () {
    $('.login__input').on('input', handleInput);

    $('.login__link').click(() => {
        localStorage.setItem('reset_password_phone', '+7 ' + $('.login__input').val() ?? '');
    })
});

function handleInput (e) {
    if (e.target.id !== 'phone') return;
    e.target.value = phoneMask(e.target.value);
};

function phoneMask (phone) {
    return phone.replace(/\D/g, '')
        .replace(/(\d{3})(\d{3})/, '$1 $2')
        .replace(/( \d{3})(\d{3})/, '$1 $2')
        .replace(/( \d{2})(\d{2})$/, '$1 $2');
};
