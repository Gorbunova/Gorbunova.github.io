document.addEventListener('DOMContentLoaded', () => {
    init100vh();
    initFixedHeader();
    initTypewrite();
    initMobileNav();
    initConsultation();

    document.querySelectorAll('.typewrite:not(.mobile-nav-content .typewrite)').forEach(btn => {
        btn.addEventListener('click', showModal);
    })

    document.querySelector('.modal__wrapper').addEventListener('click', (e) => {
        if (!document.querySelector('.modal__inner').contains(e.target)
            || e.target.classList.contains('close')
        ) hideModal();
    });

    /* Main page */
    const slider = document.querySelector('.talk__slider-inner');
    if (slider) setTimeout(sliderInit, 250);

    document.querySelector('.qualities__button')?.addEventListener('click', showModal);
    document.querySelector('.promo__button')?.addEventListener('click', showModal);

    /* Mobile portal */
    const reviewItem = document.querySelector('.portal-review__item');
    if (reviewItem) initReviewAccordeon();

    const faqItem = document.querySelector('.portal-faq__item');
    if (faqItem) initFaqAccordeon();

    document.querySelector('.portal__button')?.addEventListener('click', showModal);
    document.querySelector('.portal-problems__button')?.addEventListener('click', showModal);
})

const initMobileNav = () => {
    const navBtn = document.querySelectorAll('.mobile-nav__toggle');
    navBtn?.forEach(btn => btn.addEventListener('click', (e) => {
        const isNavOpened = btn.classList.contains('open');
        const isCloseBtn = e.target.classList.contains('mobile-nav__humburger');

        if (isNavOpened && isCloseBtn) closeMobileNav(btn);
        else openMobileNav(btn);

        const navClose = document.querySelector('.mobile-nav-content__close');
        navClose?.addEventListener('click', () => closeMobileNav(btn));

        const navItems = document.querySelectorAll('.mobile-nav-content nav ul li a');
        navItems?.forEach(navItem => {
            navItem.addEventListener('click', () => closeMobileNav(btn));
        });

        const navTypewrite = document.querySelector('.mobile-nav-content .typewrite')
        navTypewrite.addEventListener('click', () => {
            closeMobileNav(btn);
            setTimeout(showModal, 500);
        });
    }));
}

const initFixedHeader = () => {
    let timeout = null;
    let lastScrollTop = 0;
    const header = document.querySelector('.fixed-header');

    const startTimeout = () => {
        timeout = setTimeout(() => {
            if (getIsAfterStartSection()) header.classList.add('active');
        }, 2000);
    };

    startTimeout();

    window.addEventListener('scroll', () => {
        const top = window.scrollY;
        const isAfterStartSection = getIsAfterStartSection();
        if (lastScrollTop > top) scrollPage(header, timeout, startTimeout, isAfterStartSection);
        else scrollPage(header, timeout, startTimeout, isAfterStartSection, true);

        lastScrollTop = top;
    });
}

const getIsAfterStartSection = () => {
    const mainStartSectionTop = document.querySelector('.solutions')?.getBoundingClientRect().top;
    const portalStartSectionTop = document.querySelector('.portal-about')?.getBoundingClientRect().top;
    const aboutStartSectionTop = document.querySelector('.about-services')?.getBoundingClientRect().top;
    return mainStartSectionTop <= 0 || portalStartSectionTop <= 0 || aboutStartSectionTop <= 0;
}

const scrollPage = (header, timeout, startTimeout, isAfterStartSection, isDown = false) => {
    clearTimeout(timeout);
    startTimeout();

    if (!isDown && isAfterStartSection && !document.querySelector('.modal__wrapper').classList.contains('active')) {
        header.classList.add('active');
    } else if (!document.querySelector('.mobile-nav__toggle').classList.contains('open')) {
        header.classList.remove('active');
    }
}

const initTypewrite = () => {
    var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 30000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) this.txt = fullTxt.substring(0, this.txt.length - 1);
        else this.txt = fullTxt.substring(0, this.txt.length + 1);

        const wrapClass = this.el.querySelector('.wrap').classList.contains('.wrap_active') ? '' : 'wrap_active';
        this.el.innerHTML = `<span class="wrap ${wrapClass}">`+this.txt+'</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) delta /= 2;

        if (!this.isDeleting && this.txt === fullTxt) {
            this.el.querySelector('.wrap').classList.remove('wrap_active');
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => that.tick(), delta);
    };

    window.onload = () => {
        var elements = document.getElementsByClassName('typewrite');

        for (var i = 0; i < elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    };
}

export const showModal = () => {
    document.querySelector('.modal__wrapper').classList.add('active');
    blockScroll();

    initConsultation(true);
};

export const hideModal = () => {
    document.querySelector('.modal__wrapper').classList.remove('active');
    unblockScroll();
};

const openMobileNav = (btn) => {
    const navContent = document.querySelector('.mobile-nav-content');

    btn.classList.add('open');
    navContent.classList.add('active');
    navContent.classList.add('shown');
    blockScroll();
};

const closeMobileNav = (btn) => {
    const navContent = document.querySelector('.mobile-nav-content');

    btn.classList.remove('open');
    navContent.classList.remove('active');
    setTimeout(() => {
        navContent.classList.remove('shown');
    }, 500);
    unblockScroll();
};

const blockScroll = () => document.body.classList.add('no-scroll');
const unblockScroll = () => document.body.classList.remove('no-scroll');

function init100vh(){
    function setHeight() {
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setHeight();
};

/* Consultation ********************************************************************** */

const initConsultation = (isModal = false) => {
    const btns = document.querySelectorAll('.consultation__btn');

    btns.forEach(btn => {
        if (isModal && btn.parentElement.getAttribute('id') !== 'modal-form') return;
        new ConsultationBtn(btn);
        new ConsultationFields(btn);
    });
}

class ConsultationBtn {
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
                    const token = document.querySelector('#captcha-container input')?.value;

                    if (token) hideModal();
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

class ConsultationFields {
    constructor(btn) {
        this.btn = btn;

        const phonemask = '+7 (___) ___-__-__';
        const startInputPosition = 4;

        let phoneVal = phonemask;
        let inputPos = startInputPosition;

        const fields = btn.parentElement.querySelectorAll('.form__field');
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

        const inputPhone = btn.parentElement.querySelectorAll('.form__input-phone');
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

/* Main page ********************************************************************** */

const sliderInit = () => {
    let sliderOffset = 0;
    const slider = document.querySelector('.talk__slider-inner');
    const cardWidth = slider.querySelector('img').clientWidth;
    const cardCount = slider.children.length;
    const sliderWidth = cardCount * cardWidth + (cardCount - 1) * 20;
    const maxSliderOffset = sliderWidth - slider.clientWidth + 20;

    let isEnableClick = true;

    const leftBtn = document.getElementById('talk-btn-left');
    const rightBtn = document.getElementById('talk-btn-right');
    const activeClass = 'talk__button_active';

    leftBtn.addEventListener('click', () => {
        if (!isEnableClick) return;

        isEnableClick = false;
        setTimeout(() => isEnableClick = true, 500);

        if (sliderOffset === 0) return;

        rightBtn.classList.add(activeClass);
        sliderOffset -= cardWidth + 20;
        slider.style = `transform: translateX(-${sliderOffset}px)`;
        if (sliderOffset === 0) leftBtn.classList.remove(activeClass);
    });

    rightBtn.addEventListener('click', () => {
        if (!isEnableClick) return;

        isEnableClick = false;
        setTimeout(() => isEnableClick = true, 500);

        if ((sliderOffset + cardWidth) > maxSliderOffset) return;

        leftBtn.classList.add(activeClass);
        sliderOffset += cardWidth + 20;
        slider.style = `transform: translateX(-${sliderOffset}px)`;
        if ((sliderOffset + cardWidth) > maxSliderOffset) rightBtn.classList.remove(activeClass);
    });
};

/* Mobile portal ********************************************************************** */

const initReviewAccordeon = () => {
    document.querySelectorAll('.portal-review__item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;
            document.querySelectorAll('.portal-review__item').forEach(item => item.classList.remove('active'));
            item.classList.add('active');
        })
    })
};

const initFaqAccordeon = () => {
    document.querySelectorAll('.portal-faq__item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;
            document.querySelectorAll('.portal-faq__item').forEach(item => item.classList.remove('active'));
            item.classList.add('active');
        })
    })
};
