
import { renderDayChart } from "./dayChart.js";
import { numberAnimation } from "./numberAnimation.js";

let getDayTotal = (day) => {
    let day_total = 0
    Object.values(day).forEach((value) => day_total += value);

    return day_total
}


let getAccordionElements = () => {
    let day_entry = document.querySelector('#week-accordion').content.cloneNode(true);
    return {
        day_entry,
        accordion_button: day_entry.querySelector("#accordion-button"),
        card_body: day_entry.querySelector('.card-body'),
        date_element: day_entry.querySelector("#date"),
        accordion_body: day_entry.querySelector("#accordion-body")

    }
}



let renderWeek = async (week) => {
    if (!week) {
        var { week } = await chrome.storage.local.get({ 'week': null });
        week = Object.fromEntries(
            Object.entries(week).sort(([a,], [b,]) => (new Date(b) - new Date(a)))
        );
    }


    if (week) {
        let accordion = document.querySelector('#accordion');
        let week_day_elements = document.createElement('div');
        let week_total = 0;
        for (const date in week) {
            const date_id = date.replaceAll(' ', '-');
            let {day_entry, accordion_button, card_body, date_element, accordion_body} = getAccordionElements();
            accordion_button.setAttribute("data-target", `#${date_id}`)
            accordion_button.setAttribute("aria-controls", `#${date_id}`)
            accordion_button.onclick = () => {
                let day_chart = renderDayChart(week[date]);
                if (!accordion_body.classList.contains("show")) {
                    card_body.append(day_chart);
                } else {
                    setTimeout(() => card_body.removeChild(card_body.lastChild), 500);
                }
            };
            date_element.textContent = date;
            accordion_body.id = date_id;
            let day_total = getDayTotal(week[date])
            week_total += day_total;
            week_day_elements.append(day_entry);
        }
        accordion.innerHTML = '';
        accordion.append(week_day_elements)
        let total_week_time_element = document.querySelector('#total-week-time');
        let week_total_time = new Date(week_total);
        total_week_time_element.innerHTML =
            `
        <span class='num'>${week_total_time.getHours() - 2}</span>h <span class='num'>${week_total_time.getMinutes()}</span>m
        `;



        let week_average_time = new Date(week_total / (Object.keys(week).length));
        document.querySelector('#week-average-h').textContent = week_average_time.getHours() - 2;
        document.querySelector('#week-average-m').textContent = week_average_time.getMinutes();
        // week_average_element.innerHTML = 
        // `
        // <span class='num'>${week_average_time.getHours()-2}</span>h <span class='num'>${week_average_time.getMinutes()}</span>m
        // `


        numberAnimation();
    }

}

export { renderWeek }