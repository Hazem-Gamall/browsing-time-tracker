import { faviconURL } from "./faviconURL.js";
import { getDayTotal } from "./getDayTotal.js";
import { msToHM } from "./millisFormatting.js";

export async function renderDayProgress(day, prev_url){
    if(!prev_url)
        ({prev_url} = await chrome.storage.local.get({'prev_url':null}));
    const websites_grid = document.querySelector("#websites-container").content.firstElementChild.cloneNode(true);
    
    for (const hostname in day) {
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
        const day_total = getDayTotal(day);

        const time_spent_on_hostname = day[hostname] + prev_url_time;
        const percentage = (time_spent_on_hostname / day_total) * 100;
        const img = website_entry.querySelector("img");
        img.src = faviconURL(`https://${hostname}`);
        img.onload = function () {
            const colorThief = new ColorThief();
            let color = undefined;
            try {
                color = colorThief.getColor(this);
            } catch (e) {
                console.log("error", e);
            }
            if (color)
                website_entry.querySelector(".progress-bar").style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;

        }
        website_entry.querySelector("span").textContent = hostname;
        const formatted_entry = msToHM(time_spent_on_hostname);
        website_entry.querySelector(".progress-bar").textContent = `${Math.floor(formatted_entry.h)}h ${Math.floor(formatted_entry.m)}m`;
        website_entry.querySelector(".progress-bar").style.width = `${percentage}%`;

        website_entry.title =
            `
        <p>${hostname}</p>
        <span>${Math.floor(formatted_entry.h)}h ${Math.floor(formatted_entry.m)}m (${Math.floor(percentage)}%)</span>
        `;


        // removeAllChildNodes(websites_grid);
        websites_grid.append(website_entry);
    }
    // websites_grid.querySelectorAll('[data-toggle="tooltip"]').forEach((element) => element.tooltip());
    $(websites_grid).find('[data-toggle="tooltip"]').tooltip();
    return websites_grid;
}