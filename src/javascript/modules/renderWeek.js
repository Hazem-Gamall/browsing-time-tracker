
import { renderDayChart } from "./dayChart.js";
import { getDayTotal } from "./getDayTotal.js";
import { msToHM } from "./millisFormatting.js";
import { numberAnimation } from "./numberAnimation.js";
import { removeAllChildNodes } from './removeAllChildNode.js';


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

const renderDayChartWithTotal = (day) => {
    let day_chart = renderDayChart(day);
    let day_total_formatted = msToHM(getDayTotal(day));
    let day_total_element = document.createElement("h5");
    day_total_element.classList.add("text-center", "mt-4");

    day_total_element.textContent = `Total time: ${day_total_formatted.h.toFixed(0)}h ${day_total_formatted.m.toFixed(0)}m`
    day_chart.append(day_total_element);
    return day_chart;
}



let renderWeek = async (week) => {
    if (!week) {
        var { week } = await chrome.storage.local.get({ 'week': {} });
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
            let { day_entry, accordion_button, card_body, date_element, accordion_body } = getAccordionElements();
            accordion_button.setAttribute("data-target", `#${date_id}`)
            accordion_button.setAttribute("aria-controls", `#${date_id}`)
            accordion_button.onclick = () => {
                const day_chart = renderDayChartWithTotal(week[date]);
                if (!accordion_body.classList.contains("show")) {
                    removeAllChildNodes(card_body);
                    card_body.append(day_chart);
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
        let week_total_formatted = msToHM(week_total);
        total_week_time_element.innerHTML =
            `
        <span class='num'>${week_total_formatted.h.toFixed(0)}</span>h <span class='num'>${week_total_formatted.m.toFixed(0)}</span>m
        `;



        let week_average_formatted = msToHM(week_total / (Object.keys(week).length));
        document.querySelector('#week-average-h').textContent = week_average_formatted.h.toFixed(0);
        document.querySelector('#week-average-m').textContent = week_average_formatted.m.toFixed(0);


        numberAnimation();
    }

}

export { renderWeek }