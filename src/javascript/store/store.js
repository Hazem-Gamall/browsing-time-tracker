import { sortDay, sortHistory, sortWeek } from "../modules/sorting.js";

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

    _history: undefined,
    get history() {
        return (async () => {
            if (!this._history) {
                const { history: temp } = await chrome.storage.local.get({ "history": {} });
                this._history = sortHistory(temp);
            }
            return this._history;
        })();
    },
}