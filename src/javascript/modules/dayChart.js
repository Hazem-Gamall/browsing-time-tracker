import { getDayTotal } from "./getDayTotal.js";
import { msToHM } from "./millisFormatting.js";
import { truncateString } from "./truncateString.js";
import { faviconURL } from "./faviconURL.js";


const getFaviconColor = (hostname, chart, index) => {
    const colorThief = new ColorThief();
    let color = undefined;
    const img = new Image();
    img.hidden = true;
    img.src = faviconURL(`https://${hostname}`);
    document.body.append(img);
    img.onload = function () {
        try {
            color = colorThief.getColor(this);
            color = `rgb(${color[0]},${color[1]},${color[2]})`;
            chart.data.datasets[0].backgroundColor[index] = color;
            chart.update('none');
        } catch (e) {
            console.log("error", e);
        }
        document.body.removeChild(this);
    }
}

const renderDayChart = (day) => {
    let color_index = 0;
    let slice_size;
    let dynamicColors = function (day_key) {
        const colors = [
            { r: 0, g: 0, b: 255 }, //blue
            { r: 60, g: 179, b: 113 }, //green
            { r: 128, g: 0, b: 128 }, //purple
            { r: 238, g: 130, b: 238 }, //pink
            { r: 255, g: 0, b: 0 }, //red
            { r: 179, g: 115, b: 123 }, //
            { r: 255, g: 165, b: 0 }, //yellow
        ]
        slice_size = colors.length + 1;
        let color = `rgb(${colors[color_index].r}, ${colors[color_index].g}, ${colors[color_index].b})`;
        color_index++;
        return color;
    };



    let day_canvas = document.createElement('canvas');
    day_canvas.width = 320
    day_canvas.height = 320
    day = Object.fromEntries(
        Object.entries(day).sort(([, a], [, b]) => b - a)
    );
    let other_count = 0;
    let hostname_totals = Object.values(day);
    hostname_totals.slice(6).forEach((val) => other_count += val);
    hostname_totals = hostname_totals.slice(0, 6);
    hostname_totals.push(other_count)
    let day_keys = Object.keys(day).slice(0, 6);
    day_keys.push('other');



    const options = {
        responsive: false,
        maintainAspectRatio: true,
        hoverOffset: 4,
        plugins: {

            legend: {
                labels: {
                    generateLabels: function (chart) {
                        const pieGenerateLabelsLegend = Chart.controllers.doughnut.overrides.plugins.legend.labels.generateLabels;
                        const labels = pieGenerateLabelsLegend(chart);
                        const truncatedLabels = labels.map((labelObject) => ({
                            ...labelObject,
                            text: truncateString(labelObject.text, 15),
                        }));

                        return truncatedLabels;

                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let day_total = context.parsed;
                        const formatted_total = msToHM(day_total);
                        return [`${context.label}`, `${formatted_total.h.toFixed(0)}h ${formatted_total.m.toFixed(0)}m`]
                    }
                }
            },
            datalabels: {
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value * 100 / sum).toFixed(0) + "%";
                    return percentage;
                },
                color: '#fff',
            }
        }

    };

    const chart = new Chart(day_canvas, {
        type: 'pie',
        data: {
            labels: day_keys,
            datasets: [{
                label: 'Time spent',
                data: hostname_totals,
                borderWidth: 1,
                backgroundColor: day_keys.map(dynamicColors)
            }]
        },
        plugins: [ChartDataLabels],
        options
    });
    let day_chart_div = document.createElement("div");

    day_keys.forEach((hostname, index) => getFaviconColor(hostname, chart, index))

    day_chart_div.append(day_canvas);
    return day_chart_div;
}

export { renderDayChart };