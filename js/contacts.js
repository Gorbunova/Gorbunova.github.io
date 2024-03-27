ymaps.ready(init);

function init() {
    const myMap = new ymaps.Map("map", {
            center: [55.767879, 37.674642],
            zoom: 14.2
        }, {
            searchControlProvider: 'yandex#search'
        });

    const isMobile = window.innerWidth < 600;

    myMap.geoObjects
        .add(new ymaps.Placemark([55.767879, 37.674642], {
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'icons/map-mark.png',
            iconImageSize: isMobile ? [40, 40] : [80, 80],
            iconImageOffset: isMobile ? [-25, -40] : [-50, -80]
        }))
}