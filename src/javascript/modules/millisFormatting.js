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


function msToDays(miliseconds) {
    const days = miliseconds / 1000 / 60 / 60 / 24;
    return days;

}

export { msToHM, msToM,msToDays }