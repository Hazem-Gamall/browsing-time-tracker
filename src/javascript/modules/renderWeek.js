
import { renderDayChart } from "./dayChart.js";
import { renderDayProgress } from "./dayProgress.js";
import { getDayTotal } from "./getDayTotal.js";
import { msToHM } from "./millisFormatting.js";
import { numberAnimation } from "./numberAnimation.js";
import { removeAllChildNodes } from './removeAllChildNode.js';


let getAccordionElements = () => {
    let day_entry = document.querySelector('#day-accordion').content.cloneNode(true);
    return {
        day_entry,
        accordion_button: day_entry.querySelector("#accordion-button"),
        card_body: day_entry.querySelector('.card-body'),
        date_element: day_entry.querySelector("#date"),
        accordion_body: day_entry.querySelector("#accordion-body"),
        toggle_btn: day_entry.querySelector("input"),
        toggle_label: day_entry.querySelector("label"),

    }
}

const renderDayChartWithTotal = async (day) => {
    let day_chart = await renderDayChart(day);
    let day_total_formatted = msToHM(getDayTotal(day));
    let day_total_element = document.createElement("h5");
    day_total_element.classList.add("text-center", "mt-4");

    day_total_element.textContent = `Total time: ${day_total_formatted.h.toFixed(0)}h ${day_total_formatted.m.toFixed(0)}m`
    day_chart.prepend(day_total_element);
    return day_chart;
}



let renderWeek = async (week) => {
    if (!week) {
        ({ week } = await chrome.storage.local.get({ 'week': {} }));
    }

    week = Object.fromEntries(
        Object.entries(week).sort(([a,], [b,]) => (new Date(b) - new Date(a)))
    );


    let accordion = document.querySelector('#accordion');
    let week_day_elements = document.createElement('div');
    let week_total = 0;
    for (const day in week) {
        const day_id = day.replaceAll(' ', '-');
        let { day_entry, accordion_button, card_body, date_element, accordion_body, toggle_btn, toggle_label } = getAccordionElements();
        toggle_btn.id = `${day}-toggle`
        toggle_label.htmlFor = `${day}-toggle`;
        accordion_button.setAttribute("data-target", `#${day_id}`)
        accordion_button.setAttribute("aria-controls", `#${day_id}`)
        accordion_button.onclick = async () => {
            removeAllChildNodes(card_body);
            const w = Object.fromEntries(
                Object.entries(week[day]).sort(([, a], [, b]) => b - a)
            );
            if (!accordion_body.classList.contains("show")) {
                if (toggle_btn.checked) {
                    card_body.append(await renderDayProgress(w))
                } else {
                    const day_chart = await renderDayChartWithTotal(week[day]);
                    card_body.append(day_chart);
                }

            }
        };
        date_element.textContent = day;
        accordion_body.id = day_id;

        week_total += getDayTotal(week[day]);
        week_day_elements.append(day_entry);


        toggle_btn.addEventListener('click', async function () {
            const w = Object.fromEntries(
                Object.entries(week[day]).sort(([, a], [, b]) => b - a)
            );
            if (this.checked) {
                removeAllChildNodes(card_body);
                card_body.append(await renderDayProgress(w));
            } else {
                removeAllChildNodes(card_body);
                card_body.append(await renderDayChartWithTotal(w));
            }
        });


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

    console.log("tooltip elements", $('[data-toggle="tooltip"]'));
    numberAnimation();

}

export { renderWeek }