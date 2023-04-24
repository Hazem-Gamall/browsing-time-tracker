import { getDayTotal, getWeekTotal } from "./getTotal.js";
import { msToHM } from "./millisFormatting.js";

export function renderWweekChart(week) {

    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 80;


    const data = {
        labels: Object.keys(week).map((key) => key.split(' ')[0]),
        datasets: [
            {
                label: 'Week usage',
                data: Object.values(week).map((day) => msToHM(getDayTotal(day)).h.toFixed(1)),
                backgroundColor: [
                    '#003f5c',
                    '#374c80',
                    '#7a5195',
                    '#bc5090',
                    '#ef5675',
                    '#ff764a',
                    '#ffa600',
                ],
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
                            value: msToHM(getWeekTotal(week) / Object.keys(week).length).h,
                            scaleID: 'y',
                            borderWidth: 1,
                            borderColor: '#FF0000'
                        }
                    ]
                }
            }
        }
    }

    const chart = new Chart(canvas, config);

    return canvas;

}