import { getWeekTotal } from '../modules/getTotal.js';
import { renderWeek } from '../modules/renderWeek.js';
import { sortHistory } from '../modules/sorting.js';

import {
    getFormattedWeekDiffPercentage, getWeekDiffPercentage,
    getPercentageArrowIconSpan
} from '../modules/weekDiffPercentage.js';
import { store } from '../store/store.js';


export function renderWeekRelativeToHistory() {

    (async () => {
        const week = await store.week;
        const history = await store.history
        if (!week || !history) {
            document.querySelector("#relative-to-last-week").append("no enough data yet");
        } else {
            const [{ total }] = Object.values(history).slice(0, 1);
            const percentage = getWeekDiffPercentage(getWeekTotal(week), total);
            const p = document.createElement("p");
            p.append(getPercentageArrowIconSpan(percentage), getFormattedWeekDiffPercentage(percentage));
            document.querySelector("#relative-to-last-week").append(p);
        }
    })()

    return renderWeek;
}