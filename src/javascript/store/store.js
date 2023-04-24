import { sortDay, sortWeek } from "../modules/sorting.js";

export const store = {
    _time_table: undefined,
    get time_table() {
        return (async () => {
            if (!this._time_table) {
                const { time_table: temp } = await chrome.storage.local.get({ "time_table": {} });
                this._time_table = sortDay(temp);
            }
            return this._time_table;
        })();
    },
    _week: undefined,
    get week() {
        return (async () => {
            if (!this._week) {
                const { week: temp } = await chrome.storage.local.get({ "week": {} });
                this._week = sortWeek(temp);
            }
            return this._week;
        })();
    },
    history: {},
}