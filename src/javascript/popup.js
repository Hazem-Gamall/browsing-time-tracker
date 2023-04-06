
import { renderDayChart } from './modules/dayChart.js'
import { faviconURL } from './modules/faviconURL.js';
import { getDayTotal } from './modules/getDayTotal.js';

let renderTable = async (chart) => {
    let { time_table, prev_url } = await chrome.storage.local.get({ 'time_table': {}, 'prev_url': null });
    console.log('time_table', time_table);
    console.log('prev_url', prev_url);

    let day_total = getDayTotal(time_table);
    let day_usage_element = document.querySelector('#day-usage');
    let day_total_time = new Date(day_total);
    day_usage_element.textContent = `${day_total_time.getHours() - 2}h ${day_total_time.getMinutes()}m`


    let websites_element = document.querySelector('#websites');
    time_table = Object.fromEntries(
        Object.entries(time_table).sort(([, a], [, b]) => b - a)
    );
    websites_element.innerHTML = ''
    if (!chart) {
        websites_element.append(renderDayChart(time_table))
    } else {
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
            let website_entry = document.querySelector("#website-card").content.cloneNode(true);
            website_entry.querySelector("#website-favicon").src = `http://www.google.com/s2/favicons?domain=${hostname}`;
            // website_entry.querySelector("#website-favicon").src = faviconURL(`https://${hostname}`);
            website_entry.querySelector("#hostname").textContent = hostname;
            website_entry.querySelector("#time-spent").textContent = new Date(time_table[hostname] + prev_url_time).toISOString().slice(11, 19);
                
            websites_element.append(website_entry);
        }
    }



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