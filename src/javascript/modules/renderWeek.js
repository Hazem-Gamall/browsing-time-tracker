
let renderDay = (day) => {
    let day_div = document.createElement('div');
    day_div.classList = 'container';
    let day_total = 0
    Object.values(day).forEach((value) => day_total += value);
    day = Object.fromEntries(
        Object.entries(day).sort(([, a], [, b]) => b - a)
    );
    let i = 0;
    let hidden_content = document.createElement('div');
    hidden_content.classList.add('hidden-content');
    for (const hostname in day) {
        let percentage = Math.ceil((day[hostname] / day_total) * 100);
        let time_spent = new Date(day[hostname]);
        let day_card =
            `
        <div class='row justify-content-center'>
            <span class='text-center'>
                ${hostname}
            </span>
        </div>
            
            <div class='row'>
                <div class='col-12'>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">${time_spent.getHours() - 2}h ${time_spent.getMinutes()}m</div>
                    </div>        
                </div>
            </div>
        `
        console.log(i)
        if (i < 7) {

            day_div.innerHTML += day_card;

        } else {
            hidden_content.innerHTML += day_card;
        }
        i++;
    }
    if (i >= 7) {


        let show_button = document.createElement('button');
        show_button.classList.add('btn', 'bg-primary', 'text-white', 'mt-3')
        show_button.textContent = 'Show More';
        show_button.onclick = () => {
            hidden_content.classList.remove('hidden-content')
            show_button.remove();
        }
        day_div.append(show_button)
    }
    day_div.append(hidden_content);
    return { day_div, day_total };
}

let renderDayChart = (day) => {
    let dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
     };

    let day_canvas = document.createElement('canvas');
    day_canvas.width = 300
    day_canvas.height = 300
    let day_total = 0
    day = Object.fromEntries(
        Object.entries(day).sort(([,a],[,b]) => b-a)
    );
    Object.values(day).forEach((value) => day_total += value);
    let other_count = 0;
    let hostname_percentages = Object.values(day).map((value) => Math.ceil((value/ day_total) * 100))
    hostname_percentages.slice(5).forEach((val)=>other_count+=val);
    hostname_percentages = hostname_percentages.slice(0,5);
    hostname_percentages.push(other_count)
    let day_keys = Object.keys(day).slice(0,5);
    day_keys.push('other');
    console.log('day keys', day_keys)
    console.log('day values', hostname_percentages)
    new Chart(day_canvas, {
        type: 'pie',
        data: {
            labels: day_keys,
            datasets: [{
                label: '# of Votes',
                data: hostname_percentages,
                borderWidth: 1,
                backgroundColor: Object.keys(day).map(dynamicColors)
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


export let renderWeek = async (week) => {
    if (!week) {
        week = await chrome.storage.local.get({ 'week': null }).week;
    }
    console.log('week', week)
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
    console.log('week', week);
    if (week) {
        let accordion = document.querySelector('#accordion');
        let week_day_elements = document.createElement('div');
        let week_total = 0;
        for (const date in week) {

            let day_entry = document.createElement('div');
            console.log(renderDay(week[date]));
            let { day_total, day_div } = renderDay(week[date])
            week_total += day_total;
            day_entry.innerHTML =
                `
            <div class="row mt-3 m-1 justify-content-center">
                <div class="card">
                    <div class="card-header" id="headingOne">
                        <div class='row justify-content-center'>
                            <button class="btn" data-toggle="collapse" data-target="#${date.replaceAll(' ', '-')}"
                                aria-expanded="true" aria-controls="${date.replaceAll(' ', '-')}">
                                <h5 class="mb-0 text-center">
                                    ${date}
                                </h5>
                            </button>
                        </div>
                    </div>
                    <div id="${date.replaceAll(' ', '-')}" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                <div class="card-body row justify-content-center">
                                </div>
                    </div>
                </div>
            </div>
            `
            let dayChart =  renderDayChart(week[date]);
            console.log(dayChart); 
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
        console.log('nums', nums)
        if (nums) {
            nums.forEach((num_element) => {
                let startValue = 0;
                let endValue = parseInt(num_element.textContent);
                console.log('end', endValue);
                let interval = 1500
                let duration = Math.floor(interval / endValue);
                if (!isNaN(endValue)) {
                    console.log('no NaN');
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
