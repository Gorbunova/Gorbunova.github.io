document.addEventListener('DOMContentLoaded', function() {
    init100vh();
    sliderInit();

    document.querySelector('.promo__header button').addEventListener('click', showModal);
    document.querySelector('.promo__wrapper button').addEventListener('click', showModal);
    document.querySelector('.modal__wrapper').addEventListener('click', (e) => {
        if (!document.querySelector('.modal__inner').contains(e.target) || e.target.classList.contains('close')) hideModal();
    });

    initTypewrite();

    const inputs = document.querySelectorAll('.consultation .form__input')
    inputs.forEach(input => input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('error')) input.parentElement.classList.remove('error');
        const allInputs = Array.from(document.querySelectorAll('.consultation  .form__input'));
        const allInputsLengths = allInputs.map(input => input.value.length);
        console.log(allInputsLengths)
        if (!allInputsLengths.includes(0)) document.querySelector('.consultation__btn').removeAttribute("disabled");
        else document.querySelector('.consultation__btn').setAttribute("disabled", true);
    }))

    const phonemask = '+7 (___) ___-__-__';
    let phoneVal = '+7 (___) ___-__-__';
    let inputPosition = 4;
    const inputPhone = document.querySelector('#phone');
    const fields = document.querySelectorAll('.form__field')
    fields.forEach(field => field.addEventListener('click', () => {
        field.querySelector('input').focus();
    }))

    inputPhone.addEventListener('focus', (e) => {
        e.preventDefault();
        inputPosition = getpos(inputPhone);
        if (inputPhone.value === '') {
            inputPhone.value = phonemask;
            inputPhone.setSelectionRange(inputPosition, inputPosition)
        }
        else {
            inputPosition = inputPhone.value.indexOf('_');
            inputPhone.setSelectionRange(inputPosition, inputPosition)
        }
    });

    inputPhone.addEventListener('click', (e) => {
        e.preventDefault();
        inputPosition = getpos(inputPhone);
        if (inputPhone.value === '') {
            inputPhone.value = phonemask;
            inputPhone.setSelectionRange(inputPosition, inputPosition)
        }
        else {
            inputPosition = inputPhone.value.indexOf('_', inputPosition);
            inputPhone.setSelectionRange(inputPosition, inputPosition)
        }
    });

    inputPhone.addEventListener('focusout', () => {
        if (inputPhone.value === phonemask) inputPhone.value = '';
    });

    inputPhone.addEventListener('input', (e) => {
        e.preventDefault();
        console.log(e)
        console.log(getpos(inputPhone))
        phoneVal = phoneVal.replace('_', e.data)
        console.log(phoneVal)
        inputPhone.value = phoneVal
        /* inputPhone.value = inputPhone.value.replace('_', e.data) */
    });

    document.querySelector('.consultation__btn').addEventListener('click', (e) => {
        e.preventDefault();
        const emailRegexp = /^\S+@\S+\.\S+$/;
        const inputEmail = document.querySelector('#email');
        if (!inputEmail.value.match(emailRegexp)) inputEmail.parentElement.classList.add('error');
        else {
            document.querySelector('.consultation__img').style.transform = 'translate(-364px, -200px) scale(0.5)';
            setTimeout(() => {
                document.querySelector('.consultation__img').style.opacity = '0';
            }, 1000);
            setTimeout(() => {
                document.querySelector('.consultation__wrapper').innerHTML = `
            <div class="consultation__sended">
                <h2>Первый шаг сделан</h2>
                <p>Скоро наш менеджер свяжется с вам для уточнения деталей</p>
            </div>
        `;
            }, 2000); 
        }
    })
})

/* const phoneValidate = () => {
    const phoneInput = document.querySelector('input[name=phone]');
    phoneInput.addEventListener('input', (e) => {
        phoneInput.value = (e.target.value.replace(/[^+ -\d]/g, ''));
    });
}; */

const initTypewrite = () => {
    var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        const dopclass = document.querySelector('.wrap').classList.contains('.wrap_active') ? '' : 'wrap_active';
        this.el.innerHTML = `<span class="wrap ${dopclass}">`+this.txt+'</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        document.querySelector('.wrap').classList.remove('wrap_active')
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        setTimeout(function() {
        that.tick();
        }, delta);
    };

    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
    };
}

function getpos(el) {
    var pos, sel;
 
    // Internet Explorer
    if (document.selection) {
        el.focus();
        if (sel=document.selection.createRange()) {
            sel.moveStart('character', -el.value.length);
            pos=sel.text.length;
        }
        // ... something wrong ...
        else {
            pos=0;
        }
    }
    // Mozilla, Chrome
    else if (el.selectionStart || el.selectionStart=='0') {
        if (el.selectionDirection) {
            if (el.selectionDirection=='backward') {
                pos=el.selectionStart;
            }
            else {
                pos=el.selectionEnd;
            }
        }
        else {
            // Opera 9
            pos=el.selectionEnd;
        }
    }
    // ... something wrong ...
    else {
        pos=0;
    }
    return parseInt(pos);
}

const sliderInit = () => {
    let sliderOffset = 0;
    const slider = document.querySelector('.talk__slider-inner');
    const cardWidth = slider.children[0].clientWidth;
    const cardCount = slider.children.length;
    const sliderWidth = cardCount * cardWidth + (cardCount - 1) * 24;
    const maxSliderOffset = sliderWidth - slider.clientWidth;

    let isEnableClick = true;

    const leftBtn = document.getElementById('talk-btn-left');
    const rightBtn = document.getElementById('talk-btn-right');
    const activeClass = 'talk__button_active';
    leftBtn.addEventListener('click', () => {
        if (!isEnableClick) return;

        isEnableClick = false;
        setTimeout(() => {
            isEnableClick = true;
        }, 500);

        if (sliderOffset === 0) return;
        rightBtn.classList.add(activeClass);
        sliderOffset -= cardWidth + 24;
        slider.style = `transform: translateX(-${sliderOffset}px)`;
        if (sliderOffset === 0) leftBtn.classList.remove(activeClass);
    });

    rightBtn.addEventListener('click', () => {
        if (!isEnableClick) return;

        isEnableClick = false;
        setTimeout(() => {
            isEnableClick = true;
        }, 500);

        if ((sliderOffset + cardWidth) > maxSliderOffset) return;
        leftBtn.classList.add(activeClass);
        sliderOffset += cardWidth + 24;
        slider.style = `transform: translateX(-${sliderOffset}px)`;
        if ((sliderOffset + cardWidth) > maxSliderOffset) rightBtn.classList.remove(activeClass);
    });
};

const showModal = () => {
    document.querySelector('.modal__wrapper').classList.add('active');
    document.body.classList.add('no-scroll');
};

const hideModal = () => {
    document.querySelector('.modal__wrapper').classList.remove('active');
    document.body.classList.remove('no-scroll');
};

function init100vh(){
    function setHeight() {
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setHeight();
};
