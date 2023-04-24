import { renderWeek } from '../modules/renderWeek.js'
import { sortHistory } from '../modules/sorting.js';
import { getFormattedWeekDiffPercentage, getPercentageArrowIconSpan, getWeekDiffPercentage } from '../modules/weekDiffPercentage.js';


export const renderHistory = (() => {
    let index = 0;

    document.querySelector('#right-arrow').addEventListener('click', () => {
        index++;
        closure()
    })
    document.querySelector('#left-arrow').addEventListener('click', () => {
        index--;
        closure();
    })

    async function closure() {
        let { history } = await chrome.storage.local.get({ 'history': null });
        let week_title = document.querySelector('#week-title');
        //     history = {
        //         "Fri Jul 01 2022 - Sat Jul 02 2022":{
        //         week: {
        //             'Fri Jul 01 2022': {
        //                 '192.168.1.1': 18370,
        //                     'business.whatsapp.com': 21618,
        //                         'developer.mozilla.org': 1467,
        //                             'developers.facebook.com': 388466,
        //                                 'extensions': 63746,
        //                                     'fast.com': 8095,
        //                                         'getbootstrap.com': 160529,
        //                                             'github.com': 31044,
        //                                                 'ndpjmleniilehoebcbpkcomfhjnppnlk': 926,
        //                                                     'newtab': 24159,
        //                                                         'settings': 4851,
        //                                                             'www.coursera.org': 1201,
        //                                                                 'www.facebook.com': 98852,
        //                                                                     'www.google.com': 33383,
        //                                                                         'www.messenger.com': 7505,
        //                                                                             'www.wati.io': 1920,
        //                                                                                 'www.youtube.com': 5217232
        //             },
        //             'Sat Jul 02 2022': {
        //                 '192.168.1.1': 18370,
        //                     'business.whatsapp.com': 21618,
        //                         'developer.mozilla.org': 1467,
        //                             'developers.facebook.com': 388466,
        //                                 'extensions': 63746,
        //                                     'fast.com': 8095,
        //                                         'getbootstrap.com': 160529,
        //                                             'github.com': 31044,
        //                                                 'ndpjmleniilehoebcbpkcomfhjnppnlk': 926,
        //                                                     'newtab': 24159,
        //                                                         'settings': 4851,
        //                                                             'www.coursera.org': 1201,
        //                                                                 'www.facebook.com': 98852,
        //                                                                     'www.google.com': 33383,
        //                                                                         'www.messenger.com': 7505,
        //                                                                             'www.wati.io': 1920,
        //                                                                                 'www.youtube.com': 5217232
        //             },
        //         },
        //         total: 6083364
        //     }
        // }

        if (history) {
            history = sortHistory(history);

            let history_list = Object.keys(history);
            if (index < history_list.length && index >= 0) {
                week_title.textContent = history_list[index];
                let { week, total: week_total } = history[history_list[index]]
                let { total: previous_week_total } = history[history_list[index + 1]] ?? { total: NaN };
                renderWeek(week);
                if (previous_week_total) {
                    const percentage = getWeekDiffPercentage(week_total, previous_week_total);
                    const p = document.createElement("p");
                    p.append(getPercentageArrowIconSpan(percentage), getFormattedWeekDiffPercentage(percentage));
                    document.querySelector("#relative-to-last-week").innerHTML = p.outerHTML;
                } else {
                    document.querySelector("#relative-to-last-week").innerHTML = `no enought data yet`
                }
                if (index == 0) {
                    document.querySelector('#left-arrow').disabled = true;

                } else {
                    document.querySelector('#left-arrow').disabled = false;
                }

                if (history_list.length == 1 || index == history_list.length - 2) {
                    document.querySelector('#right-arrow').disabled = true;
                } else {
                    document.querySelector('#right-arrow').disabled = false;
                }
            }
            // for(const week in history){
            //     let week_history_div = document.createElement('div');
            //     week_history_div.innerHTML = 
            //     `
            //     <p>${JSON.stringify(history[week])}</p>
            //     `
            //     console.log(history[week])
            //     week_div.append(week_history_div);
            // }
        }


    }

    return closure;

})
