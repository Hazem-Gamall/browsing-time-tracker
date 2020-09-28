var prevStartTime;
var hostname;
var tabURL;
var timeTable = {};

var userOptionsTable = {};

var day = new Date().toISOString().substr(8,2);

chrome.storage.local.set({day: day}, function() {
    console.log("day set to: ", day);
});

var focus = true;

var focus_timer;

var activeState = 'active';

var trackAll =null;


chrome.storage.local.get(['optionsTable', 'userOptionsTable', 'trackAll'], function(data){
    trackAll = data.trackAll;
    userOptionsTable = data.userOptionsTable;
    console.log("trackAll: ", trackAll);
    timeTable = data.optionsTable;

    console.log("timeTable: ", Object.keys(timeTable), Object.values(timeTable));
    console.log("userOptionsTable: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
});


    focus_timer = setInterval(function(){
        if(activeState === 'active'){
            query();
        }else{
            clearInterval(focus_timer);
            console.log("NOT ACTIVE");
        }
    },500);
    



chrome.storage.onChanged.addListener(function(changes, namespace){
    for(var key in changes){
        console.log("key: ", key,"changes: ", changes[key]);
        if(key === 'optionsTable'){
            timeTable = changes[key].newValue;
        }
        if(key === 'trackAll'){
            trackAll = changes[key].newValue;
        }
        if(key === 'userOptionsTable'){
            userOptionsTable = changes[key].newValue;
        }
        if(key === 'day'){
            if(changes[key].newValue !== (new Date().toISOString().substr(8,2))){
                day = new Date().toISOString().substr(8,2);
                reset();
            }
        }
        console.log("timeTable Now: ", Object.keys(timeTable), Object.values(timeTable));
    }
});




chrome.idle.onStateChanged.addListener(function(newState){
    console.log("state: ", newState);
    activeState = newState;


    if(activeState === 'active'){
        prevStartTime = new Date();
        focus_timer = setInterval(function(){
            query();
        },500);
    }else{
        clearInterval(focus_timer);
        console.log("NOT ACTIVE");
        }
    
});




function calculateTime(){
    if(trackAll === undefined){
        trackAll = true;
    }
    if(timeTable === undefined){
        timeTable = {};

    }
    if(userOptionsTable === undefined){
        userOptionsTable = {};
    }
    
    if(!trackAll && hostname in userOptionsTable){
        endTime = new Date();
        var dif = endTime - prevStartTime;
        console.log("not tracking!");
        userOptionsTable[hostname] += dif;
        console.log(userOptionsTable[hostname]);
        
    }else if(trackAll){
        if(!(hostname in timeTable)){
            if(hostname !== "newtab" && hostname !== "extensions" && hostname !== 'ndpjmleniilehoebcbpkcomfhjnppnlk' ){
                timeTable[hostname] =0;
            }
        } 
        endTime = new Date();
        var dif = endTime - prevStartTime;
    
        timeTable[hostname] += dif;
        console.log("tracking all: ", Object.keys(timeTable), Object.values(timeTable));
    }
}

function reset(){
    chrome.storage.local.set({optionsTable: new Object()}, function() {
        console.log("optionsTable reseted to: ", Object.keys(timeTable), Object.values(timeTable));
    });
    chrome.storage.local.set({userOptionsTable: new Object()}, function() {
        console.log("userOptionsTable reseted to: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
    });   
}

function query(){
    chrome.windows.getCurrent(function(browser){
        focus = browser.focused;
      });

      if(focus){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                var tabURL = tabs[0].url;
                try{
                    hostname = (new URL(tabURL).hostname);
                    console.log("hostname: ", hostname);
                    startTime = new Date();
        
                    calculateTime();
                    console.log("after calculate time: ", Object.keys(timeTable), Object.keys(userOptionsTable));
        
                    prevStartTime = startTime;
                }
                catch(err){
                    console.error(err);
                }


                chrome.storage.local.set({optionsTable: timeTable}, function() {
                    console.log("optionsTable set to: ", Object.keys(timeTable), Object.values(timeTable));
                });
                chrome.storage.local.set({userOptionsTable: userOptionsTable}, function() {
                    console.log("userOptionsTable set to: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
                });
            })
      }else{
          prevStartTime = new Date();
          console.log("not in focus");
      }
}