import { getWeekTotal } from "./modules/getTotal.js";
import { msToBadgeFormat, msToDays, msToM, msToS } from "./modules/millisFormatting.js";
import { sortDay, sortWeek } from "./modules/sorting.js";

chrome.alarms.create('oneMinuteAlarm', { periodInMinutes: 1 });
let save_day = async (prev_day) => {
    let { time_table, week } = await chrome.storage.local.get({ 'time_table': null, 'week': {} })
    week[prev_day] = time_table;
    await chrome.storage.local.set({ 'prev_day': (new Date()).toDateString(), week });
    await chrome.storage.local.remove('time_table');
}

let newDayCheck = async () => {
    let { prev_day } = await chrome.storage.local.get({ 'prev_day': null });
    if (prev_day) {
        let today = (new Date()).toDateString();
        if (prev_day != today) {
            await save_day(prev_day);
        }
    } else {
        chrome.storage.local.set({ 'prev_day': (new Date()).toDateString() });
    }
}

let newWeekCheck = async () => {
    let today = new Date().getDay();
    const SUNDAY = 0;
    let { week, prev_sunday } = await chrome.storage.local.get({ 'week': null, 'prev_sunday': null });
    let week_passed = false;
    if (prev_sunday) {
        prev_sunday = new Date(prev_sunday);
        let week_diff_days = Math.floor(msToDays(new Date() - prev_sunday));
        if (week_diff_days >= 7)
            week_passed = true;
    } else if (week) {
        const [[oldest_day,]] = Object.keys(sortWeek(week)).slice(-1);
        const oldest_date = new Date(oldest_day);
        let week_diff_days = Math.floor(msToDays(new Date() - oldest_date));
        if (week_diff_days < 7 && (oldest_date.getDay() > new Date().getDay())) {
            week_passed = true;
        }
    }
    if (today === SUNDAY || week_passed) {
        console.log("new week check");

        if (week) {
            let week_dates = Object.keys(week).map((day) => new Date(day));
            let [min_day, max_day] = [new Date(Math.min.apply(null, week_dates)), new Date(Math.max.apply(null, week_dates))];
            let { history } = await chrome.storage.local.get({ 'history': {} });
            history[`${min_day.toDateString()} - ${max_day.toDateString()}`] = { week, total: getWeekTotal(week) };
            chrome.storage.local.set({ history, 'week2': week, 'prev_sunday': new Date().toDateString() });
            chrome.storage.local.remove('week');
        }
    } else {
        console.log("today isn't sunday");
    }
}

const handleAlarm = async (alarm) => {
    calculateTime();
    newDayCheck();
    newWeekCheck();
}

chrome.alarms.onAlarm.addListener(handleAlarm);

function updateBadgeText(tab_hostname_time) {
    let badge_time_fromatted = msToBadgeFormat(tab_hostname_time);
    chrome.action.setBadgeText({ text: badge_time_fromatted });
}


//on page updated, tab changed, state is idle/locked, or window is back in focus
let calculateTime = async () => {
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    if (tab) {
        // console.log('activated tab', tab.url);
        let { prev_time, time_table, idle_state, vid_status, inFocus } = await chrome.storage.local.get({ 'prev_time': null, 'time_table': {}, 'idle_state': false, 'vid_status': null, 'inFocus': true })

        console.log({ idle_state }, { inFocus }, { vid_status });
        if (inFocus && (!idle_state || vid_status === 'play')) {
            let tab_url;
            try {
                tab_url = new URL(tab.url);
            } catch (e) {
                console.log("exception in converting url", e);
                console.log('tab: ', tab);
                return;
            }

            const time_diff = (new Date).getTime() - prev_time;
            if (time_table[tab_url.hostname]) {
                time_table[tab_url.hostname] += time_diff;
            } else {
                time_table[tab_url.hostname] = time_diff;
            }
            updateBadgeText(time_table[tab_url.hostname]);
            console.log("time_table updated");

        } else {
            console.log("idle", { idle_state }, { vid_status });
        }
        await chrome.storage.local.set(
            {
                prev_time: new Date().getTime(),
                time_table
            }
        );
    }
};

chrome.tabs.onActivated.addListener(() => { console.log('on Activated'); calculateTime(); });

chrome.tabs.onUpdated.addListener(() => { console.log('on Updated'); calculateTime(); });

chrome.action.setBadgeBackgroundColor({ color: "cyan" });


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('message is here', message);

    await chrome.storage.local.set({ 'vid_status': message });

});

function checkBrowserFocus() {
    chrome.windows.getCurrent(function (browser) {
        chrome.storage.local.set({ inFocus: browser.focused });
    })
}

function checkUserIdle() {
    chrome.idle.queryState(
        30, // seconds
        async function (newState) {
            if (newState === "active") {
                chrome.storage.local.set({ 'idle_state': false });
            } else {
                chrome.storage.local.set({ 'idle_state': true });
            }
        }
    );
}

setInterval(() => { checkUserIdle(); checkBrowserFocus(); calculateTime(); }, 1000)
