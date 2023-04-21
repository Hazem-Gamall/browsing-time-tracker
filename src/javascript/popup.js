
import { renderDayChart } from './modules/dayChart.js'
import { renderDayProgress } from './modules/dayProgress.js';
import { getDayTotal } from './modules/getTotal.js';
import { msToHM, msToM } from './modules/millisFormatting.js';
import { removeAllChildNodes } from './modules/removeAllChildNode.js';
import { sortDay } from './modules/sorting.js';

let renderTable = async (chart) => {
    let { time_table, prev_url } = await chrome.storage.local.get({ 'time_table': {}, 'prev_url': null });


    let day_total = getDayTotal(time_table);
    let day_usage_element = document.querySelector('#day-usage');
    const formatted_total = msToHM(day_total);
    day_usage_element.textContent = `${Math.floor(formatted_total.h)}h ${Math.floor(formatted_total.m)}m`


    const websites_card = document.querySelector('#websites-card');
    time_table = sortDay(time_table);

    removeAllChildNodes(websites_card);

    if (!chart) {
        websites_card.append(renderDayChart(time_table))
        return;
    }
    const day_progress = renderDayProgress(time_table, prev_url)
    websites_card.append(day_progress);

}


let today_element = document.querySelector('#today');
today_element.textContent = `Today, ${new Date().toDateString()}`

let btn = document.querySelector('#clear-btn');
if (btn)
    btn.addEventListener('click', async () => {
        let { history } = await chrome.storage.local.get({ 'history': {} });

        await chrome.storage.local.clear();
        await chrome.storage.local.set({ history });
        location.reload();
    });


let toggle_btn = document.querySelector('#more-detail-switch')
toggle_btn.addEventListener('click', () => {
    renderTable(toggle_btn.checked)
});

renderTable();