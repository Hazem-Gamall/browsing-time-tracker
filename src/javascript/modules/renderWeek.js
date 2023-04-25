
import { store } from "../store/store.js";
import { renderDayChart } from "./dayChart.js";
import { renderDayProgress } from "./dayProgress.js";
import { getDayTotal } from "./getTotal.js";
import { msToHMS, msToTextFormat } from "./millisFormatting.js";
import { localizeAndFloor, min, sec, hour, localizeHtml } from "../localization/localize.js";
import { numberAnimation } from "./numberAnimation.js";
import { removeAllChildNodes } from "./removeAllChildNode.js";
import { sortDay } from "./sorting.js";
import { renderWweekChart } from "./weekChart.js";

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
    let day_total_formatted = msToTextFormat(getDayTotal(day),true);
    let day_total_element = document.createElement("h5");
    day_total_element.classList.add("text-center", "mt-4");

    day_total_element.textContent = `${chrome.i18n.getMessage("total_time")}: ${day_total_formatted}`
    day_chart.prepend(day_total_element);
    return day_chart;
}



const renderWeek = async (week) => {
    if (!week) {
        week  = await store.week;
    }


    let accordion = document.querySelector('#accordion');
    let week_day_elements = document.createElement('div');
    let week_total = 0;
    for (const day_key in week) {
        const day_key_id = day_key.replaceAll(' ', '-');
        let { day_entry, accordion_button, card_body, date_element, accordion_body, toggle_btn, toggle_label } = getAccordionElements();
        toggle_btn.id = `${day_key}-toggle`
        toggle_label.htmlFor = `${day_key}-toggle`;
        toggle_label.textContent = chrome.i18n.getMessage("more_details");
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
    let week_total_formatted = msToHMS(week_total);
    console.log(week_total_formatted);
    total_week_time_element.innerHTML =
        `
        <span class='num' data-number="${week_total_formatted.h}">${localizeAndFloor(week_total_formatted.h)}</span><span>${hour}</span>
        <span class='num' data-number="${week_total_formatted.m}">${localizeAndFloor(week_total_formatted.m)}</span><span>${min}</span>
        `;



    let week_average_formatted = msToHMS(week_total / (Object.keys(week).length));
    document.querySelector('#week-average-h').textContent = localizeAndFloor(week_average_formatted.h);
    document.querySelector('#week-average-h').dataset.number = Math.floor(week_average_formatted.h)

    document.querySelector('#week-average-m').textContent = localizeAndFloor(week_average_formatted.m);
    document.querySelector('#week-average-m').dataset.number = Math.floor(week_average_formatted.m)
    removeAllChildNodes(document.querySelector('#week-chart'));
    document.querySelector('#week-chart').append(renderWweekChart(week));

    numberAnimation();
}

export { renderWeek }