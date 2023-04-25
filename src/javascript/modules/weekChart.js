import { getDayTotal, getWeekTotal } from "./getTotal.js";
import { msToHMS } from "./millisFormatting.js";

export function renderWweekChart(week) {

    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 80;


    const data = {
        labels: Object.keys(week).map((key) => key.split(' ')[0]),
        datasets: [
            {
                label: 'Week usage',
                data: Object.values(week).map((day) => msToHMS(getDayTotal(day)).h.toFixed(1)),
                backgroundColor: ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"],
                // barThickness:10,


            }
        ],
        }

    const config = {
        type: 'bar',
        data,
        options:{
            responsive: false,
            maintainAspectRatio: false,
            plugins:{
                legend:{
                    display:false
                },
                annotation:{
                    annotations:[
                        {
                            type:'line',
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
    }

    const chart = new Chart(canvas, config);

    return canvas;

}