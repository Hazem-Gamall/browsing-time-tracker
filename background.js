var prevStartTime;
var hostname;
var tabURL;
var timeTable = {};

var userOptionsTable = {};

var day;

var pause = false;

var focus = true;

var focus_timer;

var activeState = 'active';

var trackAll =null;

var vidStatus;

chrome.management.onEnabled.addListener(function(){
});

chrome.browserAction.setBadgeBackgroundColor({color: "red"});

//inatialize the day when the extension is first installed
chrome.runtime.onInstalled.addListener(function(){
    day = new Date().toString().substr(8,2);
    chrome.storage.local.set({day:day},function(){
        // console.log("day has been set to: ", day);
    });
});

//get the data for the first time background.js runs
chrome.storage.local.get(['optionsTable', 'userOptionsTable', 'trackAll', 'day'], function(data){
    trackAll = data.trackAll;
    userOptionsTable = data.userOptionsTable;
    // console.log("trackAll: ", trackAll);
    timeTable = data.optionsTable;

    
    day = data.day;
    // console.log("day get: ", day);
    if(day !== (new Date().toISOString().substr(8,2))){
        reset();
        day = new Date().toString().substr(8,2);
    
        chrome.storage.local.set({day:day},function(){
            // console.log("day has been set to: ", day);
        })
    }else{
        // console.log("day is the same");
    }
    

    // console.log("timeTable: ", Object.keys(timeTable), Object.values(timeTable));
    // console.log("userOptionsTable: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
  
});






//checks if chrome is still in focus or not every 500ms if in focus query tab and calculate time, if not stop
function checkState(){
    // console.log('checkState');


    if(activeState === 'active' || (vidStatus === 'progress' &&  activeState === "idle" && !pause)){   //check if the system is active(not locked)
        // console.log('vidstatus: ', vidStatus);
        
        focus_timer = setInterval(function(){
            if(day !== (new Date().toString().substr(8,2))){
                // console.log("new Day");
                day = new Date().toString().substr(8,2);
                chrome.storage.local.set({day,day});
                reset();
            }
            // console.log("pause check", pause);
            query();

            },500);
        }else{  //idle or locked or paused
            clearInterval(focus_timer);
            // console.log("NOT ACTIVE");
        }
    
    
}

checkState();


//if the memory saved is changed i.e: the user changes something in the options
//it also updates the table variables with the newly set values
chrome.storage.onChanged.addListener(function(changes, namespace){
    for(var key in changes){
        // console.log("key: ", key,"changes: ", changes[key]);
        if(key === 'optionsTable'){
            timeTable = changes[key].newValue;
        }
        if(key === 'trackAll'){
            trackAll = changes[key].newValue;
        }
        if(key === 'userOptionsTable'){
            userOptionsTable = changes[key].newValue;
        }
        if(key === 'day'){//unused for now
            day = changes[key].newValue;
        }
        // console.log("timeTable Now: ", Object.keys(timeTable), Object.values(timeTable));
    }
});


chrome.runtime.onMessage.addListener(
    function(message, sender) {
        // console.log('sender: ', sender.tab.active);
        // console.log("message: ", message);
      if (message === "progress" && sender.tab.active){
            // console.log('progress');
            vidStatus = message;
      }else if(message === "pause"){
        pause = true;

      }else if(message === "play"){
        pause = false;
        checkState();
        // console.log(pause);
      }else{
          vidStatus = message;
        //   console.log('Ended');
      }
    //   console.log('vidstatus in message: ', vidStatus);
   });


chrome.idle.onStateChanged.addListener(function(newState){//if the state oh the systen changes
    activeState = newState;

    // console.log("activeState: ", activeState);
        prevStartTime = new Date();//set the start time to right before queryin so that the time spent idle isn't counted
        checkState();
});




function calculateTime(){
    //if it's the first time running and the user hasn't set websites to track
    //initalize these variables to begin using them
    if(trackAll === undefined){
        trackAll = true;
    }
    if(timeTable === undefined){
        timeTable = {};

    }
    if(userOptionsTable === undefined){
        userOptionsTable = {};
    }
    
    
    //when only tracking user-specefied websites we check if it's in the user-populated table
    if(!trackAll && hostname in userOptionsTable){
        endTime = new Date();
        var dif = endTime - prevStartTime;
        // console.log("not tracking!");
        userOptionsTable[hostname] += dif;

        chrome.browserAction.setBadgeText({text: (new Date(userOptionsTable[hostname]).toISOString().substr(13,2))});
        // console.log(userOptionsTable[hostname]);
        
    }else if(trackAll){//if we track all then we want all websites to be added to the table
        if(!(hostname in timeTable)){
            //if not in the table already, add it and initalize it to 0
            if(hostname !== "newtab" && hostname !== "extensions" && hostname !== 'ndpjmleniilehoebcbpkcomfhjnppnlk' ){
                timeTable[hostname] =0;
            }
        } 
        endTime = new Date();
        var dif = endTime - prevStartTime;
    
        timeTable[hostname] += dif;
        
        chrome.browserAction.setBadgeText({text: msToMin(timeTable[hostname])});
        
        // console.log("tracking all: ", Object.keys(timeTable), Object.values(timeTable));
    }
}

function reset(){
    timeTable = {};
    chrome.storage.local.set({optionsTable: timeTable}, function() {
        // console.log("optionsTable reseted to: ", Object.keys(timeTable), Object.values(timeTable));
    });
    for(var key in userOptionsTable){userOptionsTable[key] = 0;}
    chrome.storage.local.set({userOptionsTable: userOptionsTable}, function() {
        // console.log("userOptionsTable reseted to: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
    });   
}

function query(){//query the tab's url

    //check if chrome is in focus
    chrome.windows.getCurrent(function(browser){
        focus = browser.focused;
      });

      if(focus){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){//query the active tab's url
                var tabURL = tabs[0].url;
                try{//error handling for if the url is incorrect
                    hostname = (new URL(tabURL).hostname);
                    // console.log("hostname: ", hostname);
                    startTime = new Date();
        
                    calculateTime();
                    // console.log("after calculate time: ", Object.keys(timeTable), Object.keys(userOptionsTable));
        
                    prevStartTime = startTime;  //set the time at the end of querying this tab
                }
                catch(err){
                    console.error(err);
                }


                chrome.storage.local.set({optionsTable: timeTable, userOptionsTable: userOptionsTable}, function() {
                    // console.log("optionsTable set to: ", Object.keys(timeTable), Object.values(timeTable));
                    // console.log("userOptionsTable set to: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
                });
            })
      }else{
          prevStartTime = new Date();   //reset time to not count it
        //   console.log("not in focus");
      }
}

function msToMin(ms){
    if(ms < 59000){
        return(Math.round((ms/1000)).toString() + "s");
    }
    var mins = ms/60000;
    // console.log(mins);
    mins = Math.floor(mins);
    if(isNaN(mins)) return;
    return (mins.toString() + 'm');
}