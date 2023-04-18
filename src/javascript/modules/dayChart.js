import { getDayTotal } from "./getDayTotal.js";
import { msToHM } from "./millisFormatting.js";
import { truncateString } from "./truncateString.js";
import { faviconURL } from "./faviconURL.js";


const setChartFaviconColor = async (hostname, chart, index) => {
    const img_url = faviconURL(`https://${hostname}`);
    const palette = await Vibrant.from(img_url).getPalette();
    const color = palette.Vibrant?._rgb ?? [192, 192, 192];
    const color_string = `rgb(${color[0]},${color[1]},${color[2]})`;
    chart.data.datasets[0].backgroundColor[index] = color_string;
}

const renderDayChart = (day) => {

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
                backgroundColor: day_keys.map(() => `rgb(10,32,113)`)
            }]
        },
        plugins: [ChartDataLabels],
        options
    });
    let day_chart_div = document.createElement("div");

    Promise.all(day_keys.map((hostname, index) => setChartFaviconColor(hostname, chart, index))).then(() => chart.update());

    day_chart_div.append(day_canvas);
    return day_chart_div;
}

export { renderDayChart };