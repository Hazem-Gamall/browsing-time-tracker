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

export { msToHM, msToM }