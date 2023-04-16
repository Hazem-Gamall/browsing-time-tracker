
import { renderDayChart } from './modules/dayChart.js'
import { faviconURL } from './modules/faviconURL.js';
import { getDayTotal } from './modules/getDayTotal.js';
import { msToHM, msToM } from './modules/millisFormatting.js';
import { removeAllChildNodes } from './modules/removeAllChildNode.js';

let renderTable = async (chart) => {
    let { time_table, prev_url } = await chrome.storage.local.get({ 'time_table': {}, 'prev_url': null });


    let day_total = getDayTotal(time_table);
    let day_usage_element = document.querySelector('#day-usage');
    const formatted_total = msToHM(day_total);
    day_usage_element.textContent = `${Math.floor(formatted_total.h)}h ${Math.floor(formatted_total.m)}m`


    const websites_card = document.querySelector('#websites-card');
    time_table = Object.fromEntries(
        Object.entries(time_table).sort(([, a], [, b]) => b - a)
    );

    removeAllChildNodes(websites_card);

    if (!chart) {
        websites_card.append(renderDayChart(time_table))
        return;
    }
    const websites_grid = document.querySelector("#websites-container").content.firstElementChild.cloneNode(true);

    for (const hostname in time_table) {
        let prev_url_time = 0;
        if (prev_url) {
            let prev_url_hostname = (new URL(prev_url.url)).hostname;
            console.log('prev_url_hostname', prev_url_hostname);
            if (prev_url_hostname == hostname) {
                prev_url_time = ((new Date()).getTime() - prev_url.time);
                console.log('equal')
            }
        }
        const website_entry = document.querySelector("#website-entry").content.firstElementChild.cloneNode(true);
        console.log('website entry', website_entry);
       
        const time_spent_on_hostname = time_table[hostname] + prev_url_time;
        const percentage = (time_spent_on_hostname / day_total) * 100;
        website_entry.querySelector("img").src = `http://www.google.com/s2/favicons?domain=${hostname}`;
        website_entry.querySelector("span").textContent = hostname;
        const formatted_entry = msToHM(time_spent_on_hostname);
        website_entry.querySelector(".progress-bar").textContent = `${Math.floor(formatted_entry.h)}h ${Math.floor(formatted_entry.m)}m`;
        website_entry.querySelector(".progress-bar").style.width = `${percentage}%`;

        website_entry.title =
         `
        <p>${hostname}</p>
        ${Math.floor(formatted_entry.h)}h ${Math.floor(formatted_entry.m)}m (${Math.floor(percentage)}%)
        `;


        // removeAllChildNodes(websites_grid);
        websites_grid.append(website_entry);
        console.log(websites_grid);

    }
    websites_card.append(websites_grid);

    $('[data-toggle="tooltip"]').tooltip()

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
    console.log('toggle_btn', toggle_btn.checked)
    if (toggle_btn.checked) {
        renderTable(true)
    } else {
        renderTable(false)
    }
});

renderTable();