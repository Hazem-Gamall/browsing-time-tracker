import { msToTextFormat } from "./millisFormatting.js";
import { truncateString } from "./truncateString.js";
import { faviconURL } from "./faviconURL.js";
import { sortDay } from "./sorting.js";


const setChartFaviconColor = async (hostname, chart, index) => {
    const img_url = faviconURL(`https://${hostname}`);
    const palette = await Vibrant.from(img_url).getPalette();
    const color = palette.Vibrant?._rgb ?? [192, 192, 192];
    const color_string = `rgb(${color[0]},${color[1]},${color[2]})`;
    chart.data.datasets[0].backgroundColor[index] = color_string;
}

const renderDayChart = (day) => {

    let day_canvas = document.createElement('canvas');
    day_canvas.width = 350
    day_canvas.height = 350
    day = sortDay(day)
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
        hoverOffset: 3,
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
                        const formatted_total = msToTextFormat(day_total, true);
                        return [`${context.label}`, `${formatted_total}`]
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
                backgroundColor: [
                    "#b30000",
                    "#7c1158",
                    "#4421af",
                    "#1a53ff",
                    "#0d88e6",
                    "#00b7c7",
                    "#5ad45a",
                    "#8be04e",
                    "#ebdc78"
                ]
            }]
        },
        plugins: [ChartDataLabels],
        options
    });
    let day_chart_div = document.createElement("div");
    day_chart_div.classList.add('row', 'justify-content-center', 'm-2')

    day_chart_div.append(day_canvas);
    return day_chart_div;
}

export { renderDayChart };