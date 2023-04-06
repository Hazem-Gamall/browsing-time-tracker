let getDayTotal = (day) => {
    let day_total = 0
    Object.values(day).forEach((value) => day_total += value);

    return day_total
}

export {getDayTotal};