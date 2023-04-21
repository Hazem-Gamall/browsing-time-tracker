import { getWeekTotal } from "./modules/getTotal.js";
import { msToDays } from "./modules/millisFormatting.js";
import { sortDay, sortWeek } from "./modules/sorting.js";

chrome.alarms.create('oneMinuteAlarm', { periodInMinutes: 1 });
let save_day = async (prev_day) => {
    let { time_table, week } = await chrome.storage.local.get({ 'time_table': null, 'week': {} })
    console.log('save day week:', week)
    week[prev_day] = time_table;
    console.log('save day week after modification:', week)
    await chrome.storage.local.set({ 'prev_day': (new Date()).toDateString(), week });
    await chrome.storage.local.remove('time_table');
    console.log('saved week', week);
}

let newDayCheck = async () => {
    let { prev_day } = await chrome.storage.local.get({ 'prev_day': null });
    console.log('prev_day', prev_day);
    console.log('today', (new Date()).toDateString());
    if (prev_day) {
        let today = (new Date()).toDateString();
        if (prev_day != today) {
            console.log('trying to save day');
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

        let week_diff_days = Math.floor(msToDays(new Date() - prev_sunday));
        if (week_diff_days >= 7)
            week_passed = true;
    } else {
        const [[oldest_day,]] = sortWeek(week).slice(-1);
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
            chrome.storage.local.set({ history, 'week2': week, 'prev_sunday': new Date() });
            chrome.storage.local.remove('week');
        }
    } else {
        console.log("today isn't sunday");
    }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
    console.log('alarm here');
    console.log('alarm', alarm);
    calculateTime();
    newDayCheck();
    newWeekCheck();

});

//on page updated, tab changed, state is idle/locked, or window is back in focus
let calculateTime = async () => {
    console.log('calculating time\n\n')
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log('tab variable', tab);
    if (tab) {
        // console.log('activated tab', tab.url);
        let { prev_url, time_table, idle_state, vid_status } = await chrome.storage.local.get({ 'prev_url': null, 'time_table': {}, 'idle_state': false, 'vid_status': null })


        console.log('tab', tab)
        console.log('prev_url', prev_url);
        console.log('time_tabl', time_table)
        console.log('idle_state', idle_state);
        console.log('vid_status', vid_status);


        if (prev_url && (!idle_state || vid_status === 'play')) {
            let tab_url;
            try {
                tab_url = new URL(tab.url);
            } catch (e) {
                console.log("exception", e);
                return;
            }


            let time_diff = new Date().getTime() - prev_url.time;
            let time_spent = new Date(time_diff + time_table[tab_url.hostname]);
            console.log('time_spent', time_spent);
            let badge_time = time_spent.getMinutes() + ((time_spent.getHours() - 2) * 60)
            console.log('badge_time', badge_time);
            chrome.action.setBadgeText({ text: (isNaN(badge_time) ? 0 : badge_time) + 'm' });
            console.log('badge updated');

            let now = new Date();
            console.log('now in ms', now.getTime());
            console.log('now', now);



            console.log('diff', (new Date).getTime() - prev_url.time);
            let prev_tab_url;
            try {
                prev_tab_url = new URL(prev_url.url);
                console.log('prev tab url', prev_tab_url.hostname);
                if (time_table[prev_tab_url.hostname]) {
                    time_table[prev_tab_url.hostname] += (new Date).getTime() - prev_url.time;
                } else {
                    time_table[prev_tab_url.hostname] = (new Date).getTime() - prev_url.time;
                }


            } catch (e) {
                console.log('ERROR', e);
            }
        } else {
            console.log("idle");
        }
        prev_url = (tab ? { 'url': tab.url, 'time': (new Date()).getTime() } : null);
        console.log('prev_url before set', prev_url);
        await chrome.storage.local.set(
            {
                prev_url,
                'idle_period': 0,
                time_table

            }
        );

        console.log('\n\n\n done calculating time')
    }
};

chrome.tabs.onActivated.addListener(() => { console.log('on Activated'); calculateTime(); });

chrome.tabs.onUpdated.addListener(() => { console.log('on Updated'); calculateTime(); });

chrome.windows.onFocusChanged.addListener(
    async (windowId) => {
        console.log(windowId);
        console.log("window focus changed!!!!!!!!!!!!!!!!!!!!");
        if (windowId == chrome.windows.WINDOW_ID_NONE) {
            console.log('no window in focus');
            await calculateTime();
            await chrome.storage.local.set({ 'prev_url': null });
            console.log('prev_url set to null in onFocusChanged')
        } else {
            console.log('window in focus', windowId);
            let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab)
                await chrome.storage.local.set({ 'prev_url': { 'url': tab.url, 'time': new Date().getTime() } });
        }
    }
)

chrome.idle.onStateChanged.addListener(async (newState) => {
    console.log('state before if condition', newState);

    if (newState != 'active') {
        let { vid_status } = await chrome.storage.local.get({ 'vid_status': null });
        if (vid_status && newState == 'idle') {
            if (vid_status == 'play') {
                console.log('state is idle but video playing');
                // return;
            }
        }
        console.log('state after if', newState);
        await calculateTime();
        await chrome.storage.local.set({ 'prev_url': null, 'idle_state': true });
        console.log('prev_url set to null in onStateChanged');
    } else {
        let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        await chrome.storage.local.set({ 'idle_state': false, 'prev_url': tab ? { 'url': tab.url, 'time': new Date().getTime() } : null });
        console.log('idlle_state is now false');
    }
})

// chrome.action.setBadgeText({ text: '' })
chrome.action.setBadgeBackgroundColor({ color: "cyan" });


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('message is here', message);

    await chrome.storage.local.set({ 'vid_status': message });

});

setInterval(calculateTime, 1000)