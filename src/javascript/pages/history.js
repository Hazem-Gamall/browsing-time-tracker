import { localizeDate, localizeMessage } from '../localization/localize.js';
import { renderWeek } from '../modules/renderWeek.js'
import { sortHistory } from '../modules/sorting.js';
import { getFormattedWeekDiffPercentage, getPercentageArrowIconSpan, getWeekDiffPercentage } from '../modules/weekDiffPercentage.js';
import { store } from '../store/store.js';


export const renderHistory = (() => {
    let index = 0;
    if(localizeMessage("@@bidi_dir") === "rtl"){
        document.querySelector('#right-arrow').classList.replace("fa-arrow-right", "fa-arrow-left")    
        document.querySelector('#left-arrow').classList.replace("fa-arrow-left", "fa-arrow-right" )    
    }
    document.querySelector('#right-arrow').addEventListener('click', () => {
        index++;
        closure()
    })
    document.querySelector('#left-arrow').addEventListener('click', () => {
        index--;
        closure();
    })

    async function closure() {
        let history = await store.history;
        let week_title = document.querySelector('#week-title');
        
        if (history) {
            let history_list = Object.keys(history);
            if (index < history_list.length && index >= 0) {
                week_title.textContent = (history_list[index].split('-').map((date) => localizeDate(new Date(date)))).join(' - ');
                let { week, total: week_total } = history[history_list[index]]
                let { week: previous_week, total: previous_week_total } = history[history_list[index + 1]] ?? { total: NaN };
                renderWeek(week);
                if (previous_week_total) {
                    const percentage = getWeekDiffPercentage(week_total / Object.keys(week).length, previous_week_total/Object.keys(previous_week).length);
                    const p = document.createElement("p");
                    p.append(getPercentageArrowIconSpan(percentage), getFormattedWeekDiffPercentage(percentage));
                    document.querySelector("#relative-to-last-week").innerHTML = p.outerHTML;
                } else {
                    document.querySelector("#relative-to-last-week").innerHTML = localizeMessage("not_enough_data");
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
        }
    }

    return closure;
    
})
