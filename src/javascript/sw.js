import { getWeekTotal } from "./modules/getTotal.js";
import { msToTextFormat, msToDays} from "./modules/millisFormatting.js";
import { sortHistory, sortWeek } from "./modules/sorting.js";

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


async function saveWeek(week){
    if (week) {
        let week_dates = Object.keys(week).map((day) => new Date(day));
        let [min_day, max_day] = [new Date(Math.min.apply(null, week_dates)), new Date(Math.max.apply(null, week_dates))];
        let { history } = await chrome.storage.local.get({ 'history': {} });
        if(Object.keys(history).length > 3){
            history = sortHistory(history);
            delete history[Object.keys(history)[Object.keys(history).length - 1]];
        }

        history[`${min_day.toDateString()} - ${max_day.toDateString()}`] = { week, total: getWeekTotal(week) };
        chrome.storage.local.set({ history, 'week2': week, 'prev_sunday': new Date().toDateString() });
        chrome.storage.local.remove('week');
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
        saveWeek(week);
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
    let badge_time_fromatted = msToTextFormat(tab_hostname_time);
    chrome.action.setBadgeText({ text: badge_time_fromatted });
}


async function isIdle(){
    const {vid_status, idle_state} =  await chrome.storage.local.get({'idle_state': false, 'vid_status': null})
    console.log({ vid_status,idle_state })
    if(idle_state === "active")
        return false;
    else if(idle_state === "idle" && vid_status === "play")
        return false;
    return true;
}

//on page updated, tab changed, state is idle/locked, or window is back in focus
let calculateTime = async () => {
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    if (tab) {
        // console.log('activated tab', tab.url);
        let { prev_time, time_table, inFocus } = await chrome.storage.local.get({ 'prev_time': null, 'time_table': {}, 'inFocus': true })
        const idle = await isIdle();
        console.log({ inFocus, idle });
        if (inFocus && !idle) {
            let tab_url;
            try {
                tab_url = new URL(tab.url);
                if(tab_url.hostname === 'newtab'){
                    throw new Error("newtab");
                }
            } catch (e) {
                chrome.action.setBadgeText({ text: '' });
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
            console.log("idle", {inFocus});
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


chrome.runtime.onMessage.addListener((() => {
    let timeoutID;
    async function closure(message, sender, sendResponse){
        console.log({timeoutID});
        console.log('message is here', message);
        await chrome.storage.local.set({ 'vid_status': message });
        clearTimeout(timeoutID);
        timeoutID = setTimeout(async () => await chrome.storage.local.set({ 'vid_status': 'pause' }), 30000)
    }
    return closure;

})());

function checkBrowserFocus() {
    chrome.windows.getCurrent(function (browser) {
        chrome.storage.local.set({ inFocus: browser.focused });
    })
}

async function checkUserIdle() {
    const {idlePeriod} = await chrome.storage.local.get({idlePeriod: 30})
    chrome.idle.queryState(
        idlePeriod, // seconds
        async function (newState) {
            chrome.storage.local.set({ 'idle_state': newState });
        }
    );
}

setInterval(() => { checkUserIdle(); checkBrowserFocus(); handleAlarm(); }, 1000)
