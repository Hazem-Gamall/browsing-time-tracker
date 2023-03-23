
let getDayTotal = (day) => {
    let day_total = 0
    Object.values(day).forEach((value) => day_total += value);
    
    return day_total
}

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
        slice_size = colors.length+1;
        let color = `rgb(${colors[color_index].r}, ${colors[color_index].g}, ${colors[color_index].b})`;
        color_index++;
        return color;
    };



    let day_canvas = document.createElement('canvas');
    day_canvas.width = 300
    day_canvas.height = 300
    let day_total = 0
    day = Object.fromEntries(
        Object.entries(day).sort(([, a], [, b]) => b - a)
    );
    Object.values(day).forEach((value) => day_total += value);
    let other_count = 0;
    let hostname_percentages = Object.values(day).map((value) => Math.ceil((value / day_total) * 100))
    hostname_percentages.slice(6).forEach((val) => other_count += val);
    hostname_percentages = hostname_percentages.slice(0, 6);
    hostname_percentages.push(other_count)
    let day_keys = Object.keys(day).slice(0, 6);
    day_keys.push('other');
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
        options: {
            responsive: false,
            maintainAspectRatio: false,
            hoverOffset: 4

        }
    });
    // document.body.innerHTML+=('<canvas  width="200" height="100"></canvas>')
    // document.body.append(day_canvas)
    return day_canvas;
}




let renderWeek = async (week) => {
    if (!week) {
        var { week } = await chrome.storage.local.get({ 'week': null });
        week = Object.fromEntries(
            Object.entries(week).sort(([a,], [b,]) => (new Date(b) - new Date(a)))
        );
    }

    // history = {
    //     'date1':{
    //         's1':244,
    //         'stackoverflow.com':42315135,
    //         's3':42315135,
    //         's4':42315135,
    //         's5':42315135,
    //         's6':42315135,
    //         's7':42315135,
    //         's8':42315135,
    //         's9':42315135,
    //         's0':42315135,
    //         's11':42315135,
    //     },
    //     'date2':{
    //         's1':42315135,'s2':42315135,'s3':42315135,'s4':42315135,'s5':42315135,'s6':42315135,
    //         's7':42315135,'s8':42315135,'s9':42315135,'s10':42315135,'s11':42315135,'s12':42315135,
    //         's3':42315135,'s3':42315135,'s3':42315135,'s3':42315135,'s3':42315135,'s3':42315135,
    //     },
    //     'date3':{}
    // }
    if (week) {
        let accordion = document.querySelector('#accordion');
        let week_day_elements = document.createElement('div');
        let week_total = 0;
        for (const date in week) {
            const date_id = date.replaceAll(' ', '-');
            let day_entry = document.querySelector('#week-accordion').content.cloneNode(true);
            day_entry.querySelector("#accordion-button").setAttribute("data-target", `#${date_id}`)
            day_entry.querySelector("#accordion-button").setAttribute("aria-controls", `#${date_id}`)
            day_entry.querySelector("#date").textContent = date;
            day_entry.querySelector("#accordion-body").id = date_id
            let day_total = getDayTotal(week[date])
            week_total += day_total;
            let dayChart = renderDayChart(week[date]);
            day_entry.querySelector('.card-body').append(dayChart)
            week_day_elements.append(day_entry);
        }
        accordion.innerHTML = '';
        accordion.append(week_day_elements)
        let total_week_time_element = document.querySelector('#total-week-time');
        let week_total_time = new Date(week_total);
        total_week_time_element.innerHTML =
            `
        <span class='num'>${week_total_time.getHours() - 2}</span>h <span class='num'>${week_total_time.getMinutes()}</span>m
        `;



        let week_average_time = new Date(week_total / (Object.keys(week).length));
        document.querySelector('#week-average-h').textContent = week_average_time.getHours() - 2;
        document.querySelector('#week-average-m').textContent = week_average_time.getMinutes();
        // week_average_element.innerHTML = 
        // `
        // <span class='num'>${week_average_time.getHours()-2}</span>h <span class='num'>${week_average_time.getMinutes()}</span>m
        // `


        let nums = document.querySelectorAll('.num');
        if (nums) {
            nums.forEach((num_element) => {
                let startValue = 0;
                let endValue = parseInt(num_element.textContent);
                let interval = 1500
                let duration = Math.floor(interval / endValue);
                if (!isNaN(endValue)) {
                    let counter = setInterval(() => {
                        if (startValue < endValue) {
                            startValue += 1;
                            num_element.textContent = startValue


                        } else {
                            clearInterval(counter);
                        }
                    }, duration)
                }
            })
        }
    }

}

export { renderDayChart, renderWeek }