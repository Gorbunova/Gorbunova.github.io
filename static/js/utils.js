export function formatTime (time) {
    let minutes = Math.trunc(time / 60);
    let seconds = time - minutes * 60;

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    return `${minutes}:${seconds}`;
}
