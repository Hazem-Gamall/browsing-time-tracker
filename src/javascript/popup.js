
import { renderDayChart } from './modules/renderWeek.js'

let renderTable = async (chart) => {
    let { time_table, prev_url } = await chrome.storage.local.get({ 'time_table': {}, 'prev_url': null });
    console.log('time_table', time_table);
    console.log('prev_url', prev_url);

    let day_total = 0
    Object.values(time_table).forEach((value) => day_total += value);
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
            let website_entry = document.createElement('div');
            website_entry.innerHTML =
                `
            <div class="row mt-3 m-1 justify-content-center">
                    <div class="card">
                        <div class="card-header pt-2 pb-0">
                            <div class='container'>
                                <div class='row justify-content-center'>
                                    <img src = 'http://www.google.com/s2/favicons?domain=${hostname}'>
                                </div>
                                <div class='row justify-content-center'>
                                    <h5 class='text-center'>
                                            ${hostname}

                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="card-text">
                                <h5 class='text-center'>
                                        ${new Date(time_table[hostname] + prev_url_time).toISOString().slice(11, 19)}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
            `;

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