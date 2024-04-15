document.addEventListener('DOMContentLoaded', () => {
    init100vh();
    initHeader();
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

    const faqItem = document.querySelector('.faq__item');
    if (faqItem) initFaqAccordeon();

    document.querySelector('.portal__button')?.addEventListener('click', showModal);
    document.querySelector('.portal-problems__button')?.addEventListener('click', showModal);

    /* AI page */
    if (document.querySelector('.ai-solutions')) {
        document.querySelector('.ai__button')?.addEventListener('click', showModal);
        document.querySelector('.ai-development__button')?.addEventListener('click', showModal);

        aiAnimationInit();
    }

    /* Development page */
    document.querySelector('.custom-dev__btn')?.addEventListener('click', showModal);
    if (document.querySelector('.custom-dev-directions')) initDevelopmentDirections();
    if (document.querySelector('.custom-dev-stack')) initDevelopmentStack();

})

const initMobileNav = () => {
    const navBtn = document.querySelectorAll('.mobile-nav__toggle');
    navBtn?.forEach(btn => btn.addEventListener('click', (e) => {
        const isNavOpened = btn.classList.contains('open');
        const isCloseBtn = e.target.classList.contains('mobile-nav__humburger');

        if (isNavOpened && isCloseBtn) closeMobileNav(btn);
        else {
            document.querySelector('.mobile-nav__subnav').classList.remove('active');
            openMobileNav(btn);
        }

        const navClose = document.querySelector('.mobile-nav-content__close');
        navClose?.addEventListener('click', () => closeMobileNav(btn));

        const navItems = document.querySelectorAll('.mobile-nav-content nav ul li a');
        navItems?.forEach(navItem => {
            navItem.addEventListener('click', () => closeMobileNav(btn));
        });

        const subnav = document.querySelector('.mobile-nav__subnav');
        const backBtn = document.querySelector('.mobile-nav__subnav span');
        const compositeNavItems = document.querySelectorAll('.mobile-nav-content nav ul li span');
        const subnavContents = document.querySelectorAll('.mobile-nav__subnav-item');
        compositeNavItems?.forEach(navItem => {
            navItem.addEventListener('click', () => {
                const navItemId = navItem.getAttribute('id');
                subnavContents.forEach(content => content.classList.remove('active'));
                document.querySelector(`#${navItemId}-content`).classList.add('active');
                subnav.classList.add('active');
                setTimeout(() => subnav.classList.add('shown'), 50);
            });
        });

        backBtn.addEventListener('click', () => {
            subnav.classList.remove('shown');
            setTimeout(() => subnav.classList.remove('active'), 250);
        })

        const navTypewrite = document.querySelector('.mobile-nav-content .typewrite')
        navTypewrite.addEventListener('click', () => {
            closeMobileNav(btn);
            setTimeout(showModal, 500);
        });
    }));
}

const initHeader = () => {
    const header = document.querySelector('.header');
    const compositeNavItems = document.querySelectorAll('.header__nav span');
    compositeNavItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            if (!header.classList.contains('full')) {
                navItem.classList.add('active');

                header.classList.add('full');
                setTimeout(() => header.classList.add('shown'), 250);

                showOverlay();
            } else {
                if (navItem.classList.contains('active')) {
                    navItem.classList.remove('active');

                    header.classList.remove('shown');
                    setTimeout(() => header.classList.remove('full'), 350);

                    hideOverlay();
                } else {
                    compositeNavItems.forEach(navItem => navItem.classList.remove('active'));
                    navItem.classList.add('active');
                }
            }

            const idNavItem = navItem.getAttribute('id');
            const idNavItemContents = document.querySelectorAll('.header__subnav');
            idNavItemContents.forEach(idNavItemContent => idNavItemContent.classList.remove('active'));
            document.querySelector(`#${idNavItem}-content`).classList.add('active');
        });
    });

    const overlay = document.querySelector('.main-overlay');
    overlay.addEventListener('click', () => {
        if (!header.classList.contains('full')) return;
        else {
            compositeNavItems.forEach(navItem => navItem.classList.remove('active'));

            header.classList.remove('shown');
            setTimeout(() => header.classList.remove('full'), 350);

            hideOverlay();
        }
    });
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

    const fixedHeader = document.querySelector('.fixed-header');
    const compositeNavItemsFixed = document.querySelectorAll('.fixed-header__nav span');
    compositeNavItemsFixed.forEach(navItem => {
        navItem.addEventListener('click', () => {
            if (!fixedHeader.classList.contains('shown')) {
                navItem.classList.add('active');
                fixedHeader.classList.add('shown');
                showOverlay();
            } else {
                if (navItem.classList.contains('active')) {
                    fixedHeader.classList.remove('shown');
                    navItem.classList.remove('active');
                    hideOverlay();
                } else {
                    compositeNavItemsFixed.forEach(navItem => navItem.classList.remove('active'));
                    navItem.classList.add('active');
                }
            }

            const idNavItem = navItem.getAttribute('id');
            const idNavItemContents = document.querySelectorAll('.fixed-header__subnav');
            idNavItemContents.forEach(idNavItemContent => idNavItemContent.classList.remove('active'));
            document.querySelector(`#${idNavItem}-content`).classList.add('active');
        });
    });

    const overlay = document.querySelector('.main-overlay');
    overlay.addEventListener('click', () => {
        if (!fixedHeader.classList.contains('shown')) return;
        else {
            compositeNavItemsFixed.forEach(navItem => navItem.classList.remove('active'));
            fixedHeader.classList.remove('shown');
            hideOverlay();
        }
    });
}

const getIsAfterStartSection = () => {
    const mainStartSectionTop = document.querySelector('.solutions')?.getBoundingClientRect().top;
    const portalStartSectionTop = document.querySelector('.portal-about')?.getBoundingClientRect().top;
    const aboutStartSectionTop = document.querySelector('.about-text')?.getBoundingClientRect().top;
    const contactsStartSectionTop = document.querySelector('.contacts-map')?.getBoundingClientRect().top;
    const aiStartSectionTop = document.querySelector('.ai-advantages')?.getBoundingClientRect().top;
    const developmentStartSectionTop = document.querySelector('.custom-dev-services')?.getBoundingClientRect().top;

    return (
        mainStartSectionTop <= 0 ||
        portalStartSectionTop <= 0 ||
        aboutStartSectionTop <= 0 ||
        contactsStartSectionTop <= 0 ||
        aiStartSectionTop <= 0 ||
        developmentStartSectionTop <= 0
    );
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

const showModal = () => {
    const header = document.querySelector('.header');
    const fixedHeader = document.querySelector('.fixed-header');
    if (header.classList.contains('full')) {
        const compositeNavItems = document.querySelectorAll('.header__nav span');
        compositeNavItems.forEach(navItem => navItem.classList.remove('active'));

        header.classList.remove('shown');
        setTimeout(() => header.classList.remove('full'), 350);

        hideOverlay();
    }

    if (fixedHeader.classList.contains('shown')) {
        const compositeNavItemsFixed = document.querySelectorAll('.fixed-header__nav span');
        compositeNavItemsFixed.forEach(navItem => navItem.classList.remove('active'));
        fixedHeader.classList.remove('shown');
        hideOverlay();
    }

    document.querySelector('.modal__wrapper').classList.add('active');
    blockScroll();

    initConsultation(true);
};

const hideModal = () => {
    document.querySelector('.modal__wrapper').classList.remove('active');
    unblockScroll();
};

const showOverlay = () => {
    const overlay = document.querySelector('.main-overlay');
    overlay.classList.add('active');
    setTimeout(() => {
        overlay.classList.add('shown');
    }, 50);
    blockScroll();
};

const hideOverlay = () => {
    document.querySelector('.modal__wrapper').classList.remove('active');
    const overlay = document.querySelector('.main-overlay');
    overlay.classList.remove('shown');
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 50);
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
/*     const btns = document.querySelectorAll('.consultation__btn');

    btns.forEach(btn => {
        if (isModal && btn.parentElement.getAttribute('id') !== 'modal-form') return;
        new ConsultationBtn(btn);
    }); */
}

/* class ConsultationBtn {
    constructor(btn) {
        this.btn = btn;

        const isModal = btn.parentElement.classList.contains('modal__form');

        if (isModal) btn.removeAttribute('disabled');

        btn.addEventListener('click', (e) => {
                const plane = btn.closest('.consultation__wrapper')?.querySelector('.consultation__img');

                if (plane) {
                    const transform = window.innerWidth > 992 ? 'translate(-364px, -200px) scale(0.5)' : 'translate(-182px, -100px) scale(0.5)'
                    plane.style.transform = transform;

                    setTimeout(() => plane.style.opacity = '0', 350);
                    setTimeout(() => {
                        btn.closest('.consultation__wrapper').innerHTML = `
                            <div class="consultation__sended">
                                <h2>Первый шаг сделан</h2>
                                <p>Скоро наш менеджер свяжется с вамC для уточнения деталей</p>
                            </div>
                        `;
                    }, 700);
                }
            }
        )
    }
} */

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
    document.querySelectorAll('.faq__item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;
            document.querySelectorAll('.faq__item').forEach(item => item.classList.remove('active'));
            item.classList.add('active');
        })
    })
};

/* AI page ********************************************************************** */

const aiAnimationInit = () => {
    /* Mobile animation */
    const infoItems = document.querySelectorAll('.ai-solutions__info-item');
    infoItems?.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;

            infoItems.forEach(infoItem => infoItem.classList.remove('active'));
            setTimeout(() => item.classList.add('active'), 250);
        })
    })

    if (window.innerWidth <= 600) return;
    /* Desktop animation */

    const solutions = document.querySelector('.ai-solutions');
    const solutionsTypes = document.querySelectorAll('.ai-solutions__type');
    const typeCircles = document.querySelectorAll('.ai-solutions__type .ai-solutions__type-circle');
    const innerSolutions = document.querySelector('.ai-solutions__inner');
    const contents = document.querySelectorAll('.ai-solutions__content');

    const typesPadding = 30;
    const typesGap = getStyle(document.querySelector('.ai-solutions__types'), 'column-gap');
    const typeSize = (window.innerHeight - typesPadding * 2 - typesGap * 4) / 5;

    solutionsTypes.forEach(type => {
        type.style.height = `${typeSize}px`;
        type.style.width = `${typeSize}px`;
    });

    let typeNumber = 0;
    let isScrolling = false;

    const solutionsPaddingTop = getStyle(solutions, 'padding-top');
    const solutionsH2Height = solutions.querySelector('h2').getBoundingClientRect().height;
    const solutionsH2mb = getStyle(solutions.querySelector('h2'), 'margin-bottom');

    const offset = 2; //Дополнительное смещение, так как не все буквы в h2 умещаются
    const topOffset = solutionsPaddingTop + solutionsH2Height + offset;

    solutions.style.minHeight = `calc(100vh + ${typeSize * 8 + solutionsPaddingTop * 2 + solutionsH2Height}px)`;

    solutionsTypes?.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            let scrollCoord = solutions.offsetTop + topOffset;
            window.scrollTo({
                top: scrollCoord + typeSize * i * 2,
                behavior: 'smooth',
            });
        });
    });

    const solutionsTop = solutions.getBoundingClientRect().top;
    const solutionsBottom = solutions.getBoundingClientRect().bottom;

    const fixedTopOffset = -topOffset;
    const fixedBottomOffset = solutionsPaddingTop - typesPadding * 2 + solutionsH2mb - offset - window.innerHeight;
    const isFixTop = solutionsTop < fixedTopOffset;
    const isFixBottom = (solutionsBottom - window.innerHeight) > fixedBottomOffset;

    if (isFixBottom && isFixTop) {
        let scrollCoord = solutions.offsetTop + topOffset;
            window.scrollTo({
                top: scrollCoord,
                behavior: 'smooth',
            });
    }
    window.addEventListener('scroll', throttleScroll, false);

    function throttleScroll(e) {
        if (isScrolling == false) {
            window.requestAnimationFrame(function () {
                scroll(e);
                isScrolling = false;
            });
        }
        isScrolling = true;
    }

    function scroll() {
        const solutionsTop = solutions.getBoundingClientRect().top;
        const solutionsBottom = solutions.getBoundingClientRect().bottom;

        const fixedTopOffset = -topOffset;
        const fixedBottomOffset = solutionsPaddingTop - typesPadding * 2 + solutionsH2mb - offset;
        const isFixTop = solutionsTop < fixedTopOffset;
        const isFixBottom = (solutionsBottom - window.innerHeight) > fixedBottomOffset;

        if (!isFixTop) {
            typeCircles[0].style.transform = `translateX(0)`;
            solutions.style.display = 'block';
        }
        if (!isFixBottom) {
            typeCircles[4].style.transform = `translateX(0)`;
            solutions.style.display = 'flex';
            solutions.style.alignItems = 'end';
        }

        const isFix = isFixTop && isFixBottom;

        if (isFix) {
            innerSolutions.style.position = 'fixed';
            innerSolutions.style.top = `-${solutionsH2Height + offset}px`;

            let activeTypeCircle = document.querySelector('.ai-solutions__type.active .ai-solutions__type-circle');

            const scrollLen = fixedTopOffset - solutionsTop;
            const newTypeNumber = getTypeNumber(scrollLen, typeSize);
            let currentTransform = typeNumber === 0 ? 0 : -typeSize;

            activeTypeCircle.style.transform = `${getTypeTranslate(typeNumber)}${currentTransform + getTypeOffset(scrollLen,  typeSize, typeNumber)}px)`;
            if (newTypeNumber !== typeNumber) {
                typeNumber = newTypeNumber;
                solutionsTypes.forEach(type => type.classList.remove('active'));
                solutionsTypes[typeNumber].classList.add('active');

                if (!contents[typeNumber].classList.contains('active')) {
                    const activeContents = document.querySelectorAll('.ai-solutions__content.active');
                    activeContents.forEach(content => content.classList.remove('shown'));
                    setTimeout(() => {
                        activeContents.forEach(content => content.classList.remove('active'));
                        contents[typeNumber].classList.add('active');
                        setTimeout(() => contents[typeNumber].classList.add('shown'), 50);
                    }, 100)
                }
            }

            activeTypeCircle = document.querySelector('.ai-solutions__type.active .ai-solutions__type-circle');
            currentTransform = typeNumber === 0 ? 0 : -typeSize;
            activeTypeCircle.style.transform = `${getTypeTranslate(typeNumber)}${currentTransform + getTypeOffset(scrollLen,  typeSize, typeNumber)}px))`;
        } else innerSolutions.style.position = 'sticky';
    }
}

const getTypeNumber = (scrollLen, typeSize) => {
    if (scrollLen <= typeSize) return 0;
    else if (scrollLen > typeSize && scrollLen <= typeSize * 3) return 1;
    else if (scrollLen > typeSize * 3 && scrollLen <= typeSize * 5) return 2;
    else if (scrollLen > typeSize * 5 && scrollLen <= typeSize * 7) return 3;
    else if (scrollLen > typeSize * 7) return 4;
}

const getTypeOffset = (scrollLen, typeSize, typeNumber) => {
    switch (typeNumber) {
        case 0:
            return scrollLen;
        case 1:
            return scrollLen - typeSize;
        case 2:
            return scrollLen - typeSize * 3;
        case 3:
            return scrollLen - typeSize * 5;
        case 4:
            return scrollLen - typeSize * 7;
    }
}

const getTypeTranslate = (typeNumber) => {
    switch (typeNumber) {
        case 0:
            return 'translateX(calc(';
        case 1:
            return 'translateY(calc(';
        case 2:
            return 'translateX(calc(-1 *';
        case 3:
            return 'translateY(calc(-1 *';
        case 4:
            return 'translateX(calc(';
    }
}

function getStyle(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    strValue = strValue.replace(/[^+\d]/g, '');

    return Number(strValue) === +strValue ? +strValue : 0;
}

/* Development page ********************************************************************** */

const initDevelopmentDirections = () => {
    const isMobile = window.innerWidth <= 600;
    const items = document.querySelectorAll('.custom-dev-directions__item');
    if (isMobile) {
        items.forEach(item => {
            const types = item.querySelectorAll('.custom-dev-directions__type');
            types.forEach((type, i) => {
                const mobileContent = document.createElement('div');
                mobileContent.innerHTML = document.querySelectorAll('.custom-dev-directions__content-inner')[i].innerHTML;
                mobileContent.classList.add('custom-dev-directions__content-mobile');
                if (i === 0) {
                    mobileContent.classList.add('active');
                    mobileContent.classList.add('shown');
                }

                type.appendChild(mobileContent);
            })
        })
    }

    items.forEach(item => {
        const types = item.querySelectorAll('.custom-dev-directions__type');
        const contents = isMobile
            ? item.querySelectorAll('.custom-dev-directions__content-mobile')
            : item.querySelectorAll('.custom-dev-directions__content');
        const closeTime = isMobile ? 150 : 100;
        const openTime = isMobile ? 150 : 50;

        types.forEach((type, i) => {
            type.addEventListener('click', () => {
                if (types[i].classList.contains('active')) return;
                types.forEach(type => type.classList.remove('active'));
                contents.forEach(content => content.classList.remove('shown'));
                setTimeout(() => {
                    contents.forEach(content => content.classList.remove('active'));
                    types[i].classList.add('active');
                    contents[i].classList.add('active');
                    setTimeout(() => contents[i].classList.add('shown'), openTime);
                }, closeTime);
            })
        })
    })
}

const initDevelopmentStack = () => {
    const winWidth = window.innerWidth;

    const getItemOffset = () => {
        if (winWidth >= 1600) return 120;
        else if (winWidth < 1600 && winWidth >= 1200) return 100;
        else return 84;
    }

    const getTopOffset = () => {
        if (winWidth >= 1600) return 188;
        else if (winWidth < 1600 && winWidth >= 1200) return 168;
        else return 128;
    }

    const topOffset = getTopOffset();
    const stackItems = document.querySelectorAll('.custom-dev-stack__item');
    stackItems.forEach((stackItem, i) => {
        stackItem.style.top = `${topOffset + i * getItemOffset()}px`;
    });
}
