function msToHM(miliseconds) {
    const h = miliseconds / 1000 / 60 / 60;
    const m = (h % 1) * 60;
    return {
        h,
        m
    }
}

function msToM(miliseconds) {
    return miliseconds / 1000 / 60;
}

function msToS(miliseconds) {
    return miliseconds / 1000;
}


function msToDays(miliseconds) {
    const days = miliseconds / 1000 / 60 / 60 / 24;
    return days;

}

function msToTextFormat(miliseconds, includeMinutes) {
    const seconds = Math.floor(msToS(miliseconds));
    if (seconds < 60)
        return `${seconds}s`
    const minutes = Math.floor(msToM(miliseconds));
    if (minutes < 60)
        return `${minutes}m`;
    const { h, m } = msToHM(miliseconds);
    
    if(includeMinutes)
        return `${Math.floor(h)}h ${Math.floor(m)}m}`
    return `${Math.floor(h)}h`;
}



export { msToHM, msToM, msToDays, msToS, msToTextFormat }