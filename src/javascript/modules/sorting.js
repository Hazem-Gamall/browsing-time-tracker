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
    const sorted_history = Object.fromEntries(
        Object.entries(history).sort(([a,], [b,]) => new Date(b.split("-")[1]) - new Date(a.split("-")[0]))
    );
    return sorted_history;
}

export {sortDay, sortWeek, sortHistory}