import { localizeDate, localizeMessage } from "../localization/localize.js";
import { getDayTotal, getWeekTotal } from "./getTotal.js";
import { msToHMS } from "./millisFormatting.js";

function clamp(min, max, val){
    return Math.max(min, Math.min(max, val));
}

function dynamicFontSizeFromSize(minFont, maxFont, size){
    const rateOfChange = -( (size)/(maxFont - minFont) );  //size - 0
    const rate = 1.8;
    const newValue = maxFont + (rateOfChange/rate) * (size); //size - 0

    return Math.floor(clamp(minFont, maxFont, newValue));
}

export function renderWeekChart(week) {

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 80;


    const data = {
        labels: Object.keys(week).map((key) => localizeDate(new Date(key)).split(' ')[0]),
        datasets: [
            {
                label: localizeMessage('Usage'),
                data: Object.values(week).map((day) => msToHMS(getDayTotal(day)).h.toFixed(1)),
                backgroundColor: ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"],
            }
        ],
    }
    const options = {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            x:{
                ticks:{
                    font:{
                        size: dynamicFontSizeFromSize(10, 14, Object.keys(week).length),
                        family:"Droid Arabic Kufi",
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            annotation: {
                annotations: [
                    {
                        type: 'line',
                        mode: "horizontal",
                        value: msToHMS(getWeekTotal(week) / Object.keys(week).length).h,
                        scaleID: 'y',
                        borderWidth: 1.1,
                        borderColor: '#001a4d'
                    }
                ]
            }
        }
    }

    const config = {
        type: 'bar',
        data,
        options
    }

    const chart = new Chart(canvas, config);

    return canvas;

}