import { initConsultationInputs, initConsultationBtn } from "./consultation.js";

document.addEventListener('DOMContentLoaded', () => {
    init100vh();
    initFixedHeader();
    initTypewrite();
    initMobileNav();

    document.querySelectorAll('.typewrite:not(.mobile-nav-content .typewrite)').forEach(btn => {
        btn.addEventListener('click', showModal);
    })

    document.querySelector('.modal__wrapper').addEventListener('click', (e) => {
        if (!document.querySelector('.modal__inner').contains(e.target)
            || e.target.classList.contains('close')
        ) hideModal();
    });
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
            const isBeforeSolutions = document.querySelector('.solutions').getBoundingClientRect().top <= 0;
            if (isBeforeSolutions) header.classList.add('active');
        }, 2000);
    };

    startTimeout();

    window.addEventListener('scroll', () => {
        const top = window.scrollY;

        if (lastScrollTop > top) scrollPage(header, timeout, startTimeout);
        else scrollPage(header, timeout, startTimeout, true);

        lastScrollTop = top;
    });
}

const scrollPage = (header, timeout, startTimeout, isDown = false) => {
    clearTimeout(timeout);
    startTimeout();

    if (!isDown && document.querySelector('.solutions').getBoundingClientRect().top <= 0 && !document.querySelector('.modal__wrapper').classList.contains('active')) {
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

    initConsultationInputs();
    initConsultationBtn();
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
