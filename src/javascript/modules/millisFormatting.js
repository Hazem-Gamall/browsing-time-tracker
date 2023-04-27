import { hour, localizeAndFloor, min, sec } from "../localization/localize.js";



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
    const seconds = msToS(miliseconds);
    if (seconds < 60){
        return `${localizeAndFloor(seconds)}${sec}`
    }
    let { h, m, s } = msToMS(miliseconds);
    if (m < 60) {
        m = localizeAndFloor(m);
        s= localizeAndFloor(s);
        if (includeSeconds)
            return `${m}${min} ${s}${sec}`;
        else
            return `${m}${min}`;
    }

    ({ h, m, s } = Object.fromEntries(
        Object.entries(msToHMS(miliseconds))
            .map(([a,b]) => [a,localizeAndFloor(b)])
    ));

    if (includeMinutes)
        return `${h}${hour} ${m}${min}`
    else if (includeSeconds)
        return `${h}${hour} ${m}${min} ${s}${sec}`
    return `${localizeAndFloor(h)}${hour}`;
}



export { msToHMS, msToMS, msToDays, msToS, msToTextFormat }