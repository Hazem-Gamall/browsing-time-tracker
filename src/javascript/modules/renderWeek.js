
import { renderDayChart } from "./dayChart.js";
import { renderDayProgress } from "./dayProgress.js";
import { getDayTotal } from "./getDayTotal.js";
import { msToHM } from "./millisFormatting.js";
import { numberAnimation } from "./numberAnimation.js";
import { sortDay, sortWeek } from "./sorting.js";

const getAccordionElements = () => {
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





const renderDayChartWithTotal = (day) => {
    let day_chart = renderDayChart(day);
    let day_total_formatted = msToHM(getDayTotal(day));
    let day_total_element = document.createElement("h5");
    day_total_element.classList.add("text-center", "mt-4");

    day_total_element.textContent = `Total time: ${day_total_formatted.h.toFixed(0)}h ${day_total_formatted.m.toFixed(0)}m`
    day_chart.prepend(day_total_element);
    return day_chart;
}



const renderWeek = async (week) => {
    if (!week) {
        ({ week } = await chrome.storage.local.get({ 'week': {} }));
    }

    week = sortWeek(week);



    let accordion = document.querySelector('#accordion');
    let week_day_elements = document.createElement('div');
    let week_total = 0;
    for (const day_key in week) {
        const day_key_id = day_key.replaceAll(' ', '-');
        let { day_entry, accordion_button, card_body, date_element, accordion_body, toggle_btn, toggle_label } = getAccordionElements();
        toggle_btn.id = `${day_key}-toggle`
        toggle_label.htmlFor = `${day_key}-toggle`;
        accordion_button.setAttribute("data-target", `#${day_key_id}`)
        accordion_button.setAttribute("aria-controls", `#${day_key_id}`)

        let day_chart, day_progress;


        const toggleCharts = () => {
            const day = sortDay(week[day_key]);
            if (toggle_btn.checked) {
                day_chart && (day_chart.style.display = "none");
                if (day_progress) {
                    day_progress.style.display = "grid"
                    return;
                }
                day_progress ||= renderDayProgress(day)
                day_progress && card_body.append(day_progress);
                return;
            }
            
            day_progress && (day_progress.style.display = "none");
            if (day_chart) {
                day_chart.style.display = "block"
                return;
            }
            day_chart ||= renderDayChartWithTotal(day)
            day_chart && card_body.append(day_chart);

        }



        const renderCharts = () => {
            if (accordion_body.classList.contains("show")) {
                setTimeout(() => {
                    day_progress && (day_progress.style.display = "none");
                    day_chart && (day_chart.style.display = "none");
                }, 300)
                return;
            }
         

            toggleCharts();

        }

        accordion_button.onclick = renderCharts;
        date_element.textContent = day_key;
        accordion_body.id = day_key_id;

        week_total += getDayTotal(week[day_key]);
        week_day_elements.append(day_entry);


        toggle_btn.onclick = toggleCharts;


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

export { renderWeek }