import { getWeekTotal } from './modules/getTotal.js';
import { renderWeek } from './modules/renderWeek.js';
import { sortHistory } from './modules/sorting.js';

import {
    getFormattedWeekDiffPercentage, getWeekDiffPercentage,
    getPercentageArrowIconSpan
} from './modules/weekDiffPercentage.js';
renderWeek();



(async function () {
    const { week, history } = await chrome.storage.local.get({ week: {}, history: {} });
    const [{ total }] = Object.values(sortHistory(history)).slice(0, 1);

    const percentage = getWeekDiffPercentage(getWeekTotal(week), total);
    const p = document.createElement("p");
    p.append(getPercentageArrowIconSpan(percentage), getFormattedWeekDiffPercentage(percentage));
    document.querySelector("#relative-to-last-week").append(p);
})()