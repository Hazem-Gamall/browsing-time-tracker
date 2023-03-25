let renderDayChart = (day) => {
    let color_index = 0;
    let slice_size;
    let dynamicColors = function () {
        const colors = [
            { r: 0, g: 0, b: 255 }, //blue
            { r: 60, g: 179, b: 113 }, //green
            { r: 106, g: 90, b: 205 }, //purple
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
    let day_total = 0
    day = Object.fromEntries(
        Object.entries(day).sort(([, a], [, b]) => b - a)
    );
    Object.values(day).forEach((value) => day_total += value);
    let other_count = 0;
    let hostname_percentages = Object.values(day);
    // .map((value) => Math.ceil((value / day_total) * 100))
    hostname_percentages.slice(6).forEach((val) => other_count += val);
    hostname_percentages = hostname_percentages.slice(0, 6);
    hostname_percentages.push(other_count)
    let day_keys = Object.keys(day).slice(0, 6);
    day_keys.push('other');


    const options = {
        responsive: false,
        maintainAspectRatio: false,
        hoverOffset: 4,
        plugins: {

            tooltip: {
                callbacks: {
                    label: function (context) {
                        let day_total = context.parsed;
                        let day_total_time = new Date(day_total);
                        return `${day_total_time.getHours() - 2}h ${day_total_time.getMinutes()}m`
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

    new Chart(day_canvas, {
        type: 'pie',
        data: {
            labels: day_keys,
            datasets: [{
                label: '# of Votes',
                data: hostname_percentages,
                borderWidth: 1,
                backgroundColor: day_keys.map(dynamicColors)
            }]
        },
        plugins: [ChartDataLabels],
        options
    });

    return day_canvas;
}

export {renderDayChart};