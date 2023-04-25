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
    const seconds = Math.floor(msToS(miliseconds));
    if (seconds < 60)
        return `${seconds}s`
    let { h, m, s } = msToMS(miliseconds);
    if (m < 60) {
        if (includeSeconds)
            return `${Math.floor(m)}m ${Math.floor(s)}s`;
        else
            return `${Math.floor(m)}m`;
    }

    ({ h, m, s } = msToHMS(miliseconds));

    if (includeMinutes)
        return `${Math.floor(h)}h ${Math.floor(m)}m`
    else if (includeSeconds)
        return `${Math.floor(h)}h ${Math.floor(m)}m ${Math.floor(s)}s`
    return `${Math.floor(h)}h`;
}



export { msToHMS, msToMS, msToDays, msToS, msToTextFormat }