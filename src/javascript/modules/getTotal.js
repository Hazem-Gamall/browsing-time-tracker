const getDayTotal = (day) => {
    let day_total = 0
    Object.values(day).forEach((value) => day_total += value);

    return day_total;
}

const getWeekTotal = (week) => {
    let week_total = 0
    Object.values(week).forEach((day) => week_total += getDayTotal(day));

    return week_total;
}

export { getDayTotal, getWeekTotal };