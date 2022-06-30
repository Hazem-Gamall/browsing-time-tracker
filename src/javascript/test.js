chrome.alarms.create('refreshBadge',{periodInMinutes:1});
chrome.alarms.create('newDayCheck', {periodInMinutes:10});
chrome.alarms.create('newWeekCheck', {periodInMinutes:1440});

let save_day = async (prev_day) => {
    let {time_table, history} = await chrome.storage.local.get({'time_table':null, 'history':{}})    
    history[prev_day] = time_table;
    await chrome.storage.local.clear();
    await chrome.storage.local.set({'prev_day':(new Date()).toDateString(), history});
    console.log('saved history', history);
}


chrome.alarms.onAlarm.addListener(async (alarm) => {
    console.log('alarm here');
    console.log('alarm', alarm);
    if(alarm.name == 'newDayCheck'){
        let {prev_day} = await chrome.storage.local.get({'prev_day':null});
        console.log('prev_day', prev_day);
        console.log('today',(new Date()).toDateString());
        if(prev_day){
            today = (new Date()).toDateString();
            if(prev_day != today){
                save_day(prev_day);
            }
        }else{
            chrome.storage.local.set({'prev_day':(new Date()).toDateString()});
        }
        
    }else if(alarm.name == 'refreshBadge'){

        let [tab] = await chrome.tabs.query({active:true, lastFocusedWindow:true});
        let {time_table, prev_url} = await chrome.storage.local.get({'time_table':null, 'prev_url':null})
        console.log('tab', tab);

        if(tab && prev_url){
            let = tab_url = new URL(tab.url);
            console.log('update badge: time_table', time_table);
            if(time_table){
                let time_diff = new Date().getTime() - prev_url.time;
                let time_spent = new Date(time_table[tab_url.hostname] + time_diff); 
                chrome.action.setBadgeText({text: (time_spent.getMinutes() + (time_spent.getHours() -2)*60)+ 'm'});
            }
        }
    }else if(alarm.name == 'newWeekCheck'){

    }
    
});

//on page updated, tab changed, state is idle/locked, or window is back in focus
let calculateTime = async () => {
    console.log('calculating time\n\n')
    let [tab] = await chrome.tabs.query({active:true, lastFocusedWindow:true});

    // console.log('activated tab', tab.url);
    let {prev_url, idle_period, time_table, idle_start_time} = await chrome.storage.local.get({'prev_url':null, 'idle_period':0, 'time_table':{}, 'idle_start_time':null})
    

    
    if(prev_url){


        console.log('prev_url', prev_url);
        console.log('prev_url time', new Date(prev_url.time))
        console.log( 'idle_start_time', new Date(idle_start_time));
        console.log('idle_period', idle_period);
    
        let now = new Date();
        console.log('now in ms', now.getTime());
        console.log('now', now);


    
        console.log('diff', (new Date).getTime() - prev_url.time - idle_period);
        let prev_tab_url;
        try{
            prev_tab_url = new URL(prev_url.url);
            console.log('prev tab url', prev_tab_url.hostname);
            if(time_table[prev_tab_url.hostname]){
                time_table[prev_tab_url.hostname] += (new Date).getTime() - prev_url.time - idle_period;
            }else{
                time_table[prev_tab_url.hostname] = (new Date).getTime() - prev_url.time - idle_period;
            }
            let time_spent = new Date(time_table[new URL(tab.url).hostname])
            // console.log('time spent', time_spent)
            let badge_time = time_spent.getMinutes() + ((time_spent.getHours()-2) * 60)
            
            chrome.action.setBadgeText({text:  (isNaN(badge_time)?0:badge_time )+ 'm'});

        }catch(e){
            console.log('ERROR', e);
        }
    }

    await chrome.storage.local.set(
        {
            'prev_url':{'url':tab.url, 'time':(new Date()).getTime()},
            'idle_period':0,
            time_table
            
        }
    );
    
    console.log('\n\n\n done calculating time')
};

chrome.tabs.onActivated.addListener(() => {console.log('on Activated');calculateTime();});

chrome.tabs.onUpdated.addListener(() => {console.log('on Updated');calculateTime();});

chrome.windows.onFocusChanged.addListener(
    async (windowId) =>{
        console.log(windowId);
        if(windowId == chrome.windows.WINDOW_ID_NONE){
            console.log('no window in focus');
            await chrome.storage.local.set({'idle_start_time':(new Date).getTime()});
        }else{
            console.log('window in focus', windowId);
            let {idle_start_time} = await chrome.storage.local.get('idle_start_time');
            console.log('idle_period', (new Date()).getTime() - idle_start_time);
            await chrome.storage.local.set({'idle_period':(new Date()).getTime() - idle_start_time, idle_start_time:undefined});
            // calculateTime();
        }
    }
)

chrome.idle.onStateChanged.addListener(async (newState) =>{
    console.log('state before if condition', newState);
    
    if(newState != 'active'){
        let {vid_status} = await chrome.storage.local.get({'vid_status':null});
        if(vid_status && newState == 'idle'){
            if(vid_status == 'play'){
                console.log('state is idle but video playing');
                return;
            }
        }
        console.log('state after if', newState);
        await calculateTime();
        await chrome.storage.local.set({'prev_url':null});
    }
})

chrome.action.setBadgeText({text:''})
chrome.action.setBadgeBackgroundColor({color: "cyan"});


chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
    console.log('message is here', message);
    await chrome.storage.local.set({'vid_status':message});
}
);