import { getWeekTotal } from '../modules/getTotal.js';
import { renderWeek } from '../modules/renderWeek.js';
import { sortHistory } from '../modules/sorting.js';

import {
    getFormattedWeekDiffPercentage, getWeekDiffPercentage,
    getPercentageArrowIconSpan
} from '../modules/weekDiffPercentage.js';


export function renderWeekRelativeToHistory() {

    (async () => {
        const { week, history } = await chrome.storage.local.get({ week: null, history: null });
        if (!week || !history) {
            document.querySelector("#relative-to-last-week").append("no enough data yet");
        } else {
            const [{ total }] = Object.values(sortHistory(history)).slice(0, 1);
            const percentage = getWeekDiffPercentage(getWeekTotal(week), total);
            const p = document.createElement("p");
            p.append(getPercentageArrowIconSpan(percentage), getFormattedWeekDiffPercentage(percentage));
            document.querySelector("#relative-to-last-week").append(p);
        }
    })()

    return renderWeek;
}