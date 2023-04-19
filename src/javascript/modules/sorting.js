function sortDay(day){
    const sorted_day = Object.fromEntries(
        Object.entries(day).sort(([, a], [, b]) => b - a)
    );

    return sorted_day;
}

function sortWeek(week){
    const sorted_week = Object.fromEntries(
        Object.entries(week).sort(([a,], [b,]) => (new Date(b) - new Date(a)))
    );

    return sorted_week;
}

function sortHistory(history){

}

export {sortDay, sortWeek, sortHistory}