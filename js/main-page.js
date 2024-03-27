import { showModal } from './script.js';
import { initConsultation } from './consultation.js';

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(sliderInit, 250);
    initConsultation();

    document.querySelector('.promo__button').addEventListener('click', showModal);
})

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
