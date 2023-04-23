function getWeekDiffPercentage(current_week_total, previous_week_total) {
    const change = (current_week_total - previous_week_total);
    const change_percentage = (change / previous_week_total) * 100;
    return change_percentage;
}

function getFormattedWeekDiffPercentage(percentage) {
    return `${Math.floor(Math.abs(percentage))}% ${percentage > 0 ? "higher" : "lower"} than last week.`
}

function getPercentageArrowIconSpan(percentage) {
    const icon_span = document.createElement("span");
    icon_span.classList.add("fa-solid", `${percentage > 0 ? "fa-circle-up" : "fa-circle-down"}`, "mr-1");
    return icon_span;

}

export {getWeekDiffPercentage, getFormattedWeekDiffPercentage, getPercentageArrowIconSpan};