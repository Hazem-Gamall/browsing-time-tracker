import { localizeMessage } from '../localization/localize.js';
import { getWeekTotal } from '../modules/getTotal.js';
import { renderWeek } from '../modules/renderWeek.js';

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
            document.querySelector("#relative-to-last-week").append(localizeMessage("no enough data yet"));
        } else {
            const [{ total, week:previous_week }] = Object.values(history).slice(0, 1);
            const average = total / Object.keys(previous_week).length;
            const percentage = getWeekDiffPercentage(getWeekTotal(week) / Object.keys(week).length, average);
            const p = document.createElement("p");
            p.append(getPercentageArrowIconSpan(percentage), getFormattedWeekDiffPercentage(percentage));
            document.querySelector("#relative-to-last-week").append(p);
        }
    })()

    return renderWeek;
}