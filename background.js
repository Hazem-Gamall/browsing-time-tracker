/*** globals ***/

var prevStartTime;

var hostname;

var timeTable = {};

var userOptionsTable = {};

var day;

var pause = false;

var activeState = 'active';

var trackAll =null;

var vidStatus;


/*** chrome utilities ***/

chrome.management.onEnabled.addListener(function(){
});

chrome.browserAction.setBadgeBackgroundColor({color: "red"});

//inatialize the day when the extension is first installed
chrome.runtime.onInstalled.addListener(function(){
    day = Date().substr(8,2);
    chrome.storage.local.set({day:day},function(){
    });
});

chrome.runtime.onMessage.addListener(
    function(message, sender) {
    
      if (message === "progress" && sender.tab.active){
            vidStatus = message;
      }else if(message === "pause"){
        pause = true;

      }else if(message === "play"){
        pause = false;
      }else{
          vidStatus = message;
      }
   });

   chrome.idle.onStateChanged.addListener(function(newState){//if the state oh the systen changes
    activeState = newState;

        prevStartTime = new Date();//set the start time to right before queryin so that the time spent idle isn't counted
        checkState();
});


/*** data ***/

//get the data for the first time background.js runs
chrome.storage.local.get(['optionsTable', 'userOptionsTable', 'trackAll', 'day'], function(data){
    trackAll = data.trackAll;
    userOptionsTable = data.userOptionsTable;
    timeTable = data.optionsTable;
  
});

//if the memory saved is changed i.e: the user changes something in the options
//it also updates the table variables with the newly set values
chrome.storage.onChanged.addListener(function(changes, namespace){
    for(var key in changes){
        if(key === 'optionsTable'){
            timeTable = changes[key].newValue;
        }
        if(key === 'trackAll'){
            trackAll = changes[key].newValue;
        }
        if(key === 'userOptionsTable'){
            userOptionsTable = changes[key].newValue;
        }
    }
});




//checks if chrome is still in focus or not every 500ms if in focus query tab and calculate time, if not stop
function checkState(){
        
        var focus_timer = setInterval(function(){
            if(activeState === 'active' || (vidStatus === 'progress' &&  activeState === "idle" && !pause)){   //check if the system is active(not locked)

            if(day !== (Date().substr(8,2))){
                alert("day: ", day + '\n', "Date(): ", (Date().substr(8,2)));
                day = Date().substr(8,2);
                chrome.storage.local.set({day,day});
                reset();
            }
            query();

            }else{  //idle or locked or paused
                clearInterval(focus_timer);
            }
    },500);

    
}

checkState();



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
        userOptionsTable[hostname] += dif;

        chrome.browserAction.setBadgeText({text: (new Date(userOptionsTable[hostname]).toISOString().substr(13,2))});
        
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
        
    }
}

function reset(){
    timeTable = {};
    chrome.storage.local.set({optionsTable: timeTable}, function() {
    });

    for(var key in userOptionsTable){userOptionsTable[key] = 0;}
    chrome.storage.local.set({userOptionsTable: userOptionsTable}, function() {
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
                    startTime = new Date();
        
                    calculateTime();
        
                    prevStartTime = startTime;  //set the time at the end of querying this tab
                }
                catch(err){
                    console.error(err);
                }


                chrome.storage.local.set({optionsTable: timeTable, userOptionsTable: userOptionsTable}, function() {
                    
                });
            })
      }else{
          prevStartTime = new Date();   //reset time to not count it
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