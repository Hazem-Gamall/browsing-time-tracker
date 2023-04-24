
import { renderDayChart } from '../modules/dayChart.js'
import { renderDayProgress } from '../modules/dayProgress.js';
import { getDayTotal } from '../modules/getTotal.js';
import { msToHM } from '../modules/millisFormatting.js';
import { removeAllChildNodes } from '../modules/removeAllChildNode.js';
import { store } from '../store/store.js';

export const renderTable = function () {
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
        closure(toggle_btn.checked)
    });



    async function closure(chart){
        let time_table = await store.time_table;


        let day_total = getDayTotal(time_table);
        let day_usage_element = document.querySelector('#day-usage');
        const formatted_total = msToHM(day_total);
        day_usage_element.textContent = `${Math.floor(formatted_total.h)}h ${Math.floor(formatted_total.m)}m`


        const websites_card = document.querySelector('#websites-card');

        removeAllChildNodes(websites_card);

        if (!chart) {
            websites_card.append(renderDayChart(time_table))
        } else {
            const day_progress = renderDayProgress(time_table)
            websites_card.append(day_progress);
        }


        let today_element = document.querySelector('#today');
        today_element.textContent = `Today, ${new Date().toDateString()}`
    }
    return closure;
}


