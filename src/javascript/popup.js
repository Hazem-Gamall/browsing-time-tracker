
import { renderDayChart } from './modules/dayChart.js'
import { faviconURL } from './modules/faviconURL.js';
import { getDayTotal } from './modules/getDayTotal.js';
import { msToHM } from './modules/msToHM.js';

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    console.log("img", img);
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

let renderTable = async (chart) => {
    let { time_table, prev_url } = await chrome.storage.local.get({ 'time_table': {}, 'prev_url': null });
    console.log('time_table', time_table);
    console.log('prev_url', prev_url);

    let day_total = getDayTotal(time_table);
    let day_usage_element = document.querySelector('#day-usage');
    let day_total_time = new Date(day_total);
    console.log("day_total", day_total)
    console.log("day_total msToHM", msToHM(day_total));
    const formatted_total = msToHM(day_total);
    day_usage_element.textContent = `${Math.floor(formatted_total.h)}h ${Math.floor(formatted_total.m)}m`


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
            website_entry.querySelector("#website-favicon").onload = function () { 
                let im = new Image();
                im.src = faviconURL("https://fadbbok.com");
                let a_base64 = getBase64Image(this);
                let b_base64 = getBase64Image(im);
                // im.onload = () => console.log("im loaded")
                console.log("b_base64", b_base64);
                if(a_base64 === b_base64){
                    console.log("corrupt image");
                    this.src = `http://www.google.com/s2/favicons?domain=${hostname}`;
                }else{
                    console.log("looks good");
                }
                
            }
            // website_entry.querySelector("#website-favicon").src = `http://www.google.com/s2/favicons?domain=${hostname}`;
            website_entry.querySelector("#website-favicon").src = faviconURL(`https://${hostname}`);
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