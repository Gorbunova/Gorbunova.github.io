export function formatTime (time) {
    let minutes = Math.trunc(time / 60);
    let seconds = time - minutes * 60;

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    return `${minutes}:${seconds}`;
}

export function init100vh(){
    function setHeight() {
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setHeight();
    window.addEventListener('resize', setHeight);
};

export function hideElement (el) {
    el.css('display', 'none');
};

export function showElement (el, display = 'block') {
    el.css('display', display);
};

export function compareArrays (arr1, arr2) {
    let el = null;
    for (let index = 0; index < arr1.length; index++) {
        const arr2index = arr2.findIndex((el) => el === arr1[index]);
        const dataObj = JSON.parse(localStorage.getItem('questionnaire_data')) ?? {};
        if (arr2index === -1 || !dataObj[arr2[arr2index]].length) {
            return arr1[index];
        }
    }
    return el;
};