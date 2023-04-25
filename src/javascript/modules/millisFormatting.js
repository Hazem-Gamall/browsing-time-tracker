const hour = chrome.i18n.getMessage("h");
const min = chrome.i18n.getMessage("m");
const sec = chrome.i18n.getMessage("s");


function msToHMS(miliseconds) {
    const h = miliseconds / 1000 / 60 / 60;
    const m = (h % 1) * 60;
    const s = (m % 1) * 60;
    return {
        h,
        m,
        s
    }
}

function msToMS(miliseconds) {
    const m = miliseconds / 1000 / 60;
    const s = (m % 1) * 60;
    return { m, s }
}

function msToS(miliseconds) {
    return miliseconds / 1000;
}


function msToDays(miliseconds) {
    const days = miliseconds / 1000 / 60 / 60 / 24;
    return days;

}

function msToTextFormat(miliseconds, includeMinutes, includeSeconds) {
    console.log({hour, min, sec})
    const seconds = Math.floor(msToS(miliseconds));
    if (seconds < 60)
        return `${seconds}${sec}`
    let { h, m, s } = msToMS(miliseconds);
    if (m < 60) {
        if (includeSeconds)
            return `${Math.floor(m)}${min} ${Math.floor(s)}${sec}`;
        else
            return `${Math.floor(m)}${min}`;
    }

    ({ h, m, s } = msToHMS(miliseconds));

    if (includeMinutes)
        return `${Math.floor(h)}${hour} ${Math.floor(m)}${min}`
    else if (includeSeconds)
        return `${Math.floor(h)}${hour} ${Math.floor(m)}${min} ${Math.floor(s)}${sec}`
    return `${Math.floor(h)}${hour}`;
}



export { msToHMS, msToMS, msToDays, msToS, msToTextFormat }