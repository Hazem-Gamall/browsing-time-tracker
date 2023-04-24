import { faviconURL } from "./faviconURL.js";
import { getDayTotal } from "./getTotal.js";
import { msToHM, msToTextFormat } from "./millisFormatting.js";

export function renderDayProgress(day, prev_url) {

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
        const day_total = getDayTotal(day);

        const time_spent_on_hostname = day[hostname] + prev_url_time;
        const percentage = (time_spent_on_hostname / day_total) * 100;
        const img = website_entry.querySelector("img");
        img.src = faviconURL(`https://${hostname}`);
        img.onload = async function () {
            let color = undefined;
            try {
                const palette = await Vibrant.from(this.src).getPalette();
                color = palette?.Vibrant?._rgb;
            } catch (e) {
                console.log("error", e);
            }
            if (color)
                website_entry.querySelector(".progress-bar").style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;

        }
        website_entry.querySelector("span").textContent = hostname;
        const formatted_entry = msToTextFormat(time_spent_on_hostname, true);
        website_entry.querySelector(".progress-bar").textContent = formatted_entry;
        website_entry.querySelector(".progress-bar").style.width = `${percentage}%`;

        website_entry.title =
            `
        <p>${hostname}</p>
        <span>${formatted_entry} (${Math.floor(percentage)}%)</span>
        `;


        // removeAllChildNodes(websites_grid);
        websites_grid.append(website_entry);
    }
    // websites_grid.querySelectorAll('[data-toggle="tooltip"]').forEach((element) => element.tooltip());
    $(websites_grid).find('[data-toggle="tooltip"]').tooltip();
    return websites_grid;
}