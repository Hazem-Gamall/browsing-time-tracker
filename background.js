var prevStartTime;
var hostname;
var tabURL;
var timeTable = {};

var userOptionsTable = {};

var day;


var focus = true;

var focus_timer;

var activeState = 'active';

var trackAll =null;

chrome.management.onEnabled.addListener(function(){

});


//inatialize the day when the extension is first installed
chrome.runtime.onInstalled.addListener(function(){
    day = new Date().toISOString().substr(8,2);
    chrome.storage.local.set({day:day},function(){
        console.log("day has been set to: ", day);
    });
});

//get the data for the first time background.js runs
chrome.storage.local.get(['optionsTable', 'userOptionsTable', 'trackAll', 'day'], function(data){
    trackAll = data.trackAll;
    userOptionsTable = data.userOptionsTable;
    console.log("trackAll: ", trackAll);
    timeTable = data.optionsTable;

    
    day = data.day;
    console.log("day get: ", day);
    if(day !== (new Date().toISOString().substr(8,2))){
        reset();
        day = new Date().toISOString().substr(8,2);
    
        chrome.storage.local.set({day:day},function(){
            console.log("day has been set to: ", day);
        })
    }else{
        console.log("day is the same");
    }
    

    console.log("timeTable: ", Object.keys(timeTable), Object.values(timeTable));
    console.log("userOptionsTable: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
  
});



//checks if chrome is still in focus or not every 500ms if in focus query tab and calculate time, if not stop
    focus_timer = setInterval(function(){
        if(activeState === 'active'){   //check if the system is active(not locked)
            if((new Date().toISOString().substr(11,8) == '00:00:00')){
                reset();
            }
            query();
        }else{  //idle or locked
            clearInterval(focus_timer);
            console.log("NOT ACTIVE");
        }
    },500);
    


//if the memory saved is changed i.e: the user changes something in the options
//it also updates the table variables with the newly set values
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
        // if(key === 'day'){//unused for now
        //     if(changes[key].newValue !== (new Date().toISOString().substr(8,2))){
        //         day = new Date().toISOString().substr(8,2);
        //         reset();
        //     }
        // }
        console.log("timeTable Now: ", Object.keys(timeTable), Object.values(timeTable));
    }
});




chrome.idle.onStateChanged.addListener(function(newState){//if the state oh the systen changes
    console.log("state: ", newState);
    activeState = newState;


    if(activeState === 'active'){
        prevStartTime = new Date();//set the start time to right before queryin so that the time spent idle isn't counted
        focus_timer = setInterval(function(){
            query();
        },500);
    }else{//idle or locked (DRY violation, think of a better solution)
        clearInterval(focus_timer);
        console.log("NOT ACTIVE");
        }
    
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
        console.log("not tracking!");
        userOptionsTable[hostname] += dif;
        console.log(userOptionsTable[hostname]);
        
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
        console.log("tracking all: ", Object.keys(timeTable), Object.values(timeTable));
    }
}

function reset(){
    chrome.storage.local.set({optionsTable: new Object()}, function() {
        console.log("optionsTable reseted to: ", Object.keys(timeTable), Object.values(timeTable));
    });
    for(var key in userOptionsTable){userOptionsTable[key] = 0;}
    chrome.storage.local.set({userOptionsTable: userOptionsTable}, function() {
        console.log("userOptionsTable reseted to: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
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
                    console.log("hostname: ", hostname);
                    startTime = new Date();
        
                    calculateTime();
                    console.log("after calculate time: ", Object.keys(timeTable), Object.keys(userOptionsTable));
        
                    prevStartTime = startTime;  //set the time at the end of querying this tab
                }
                catch(err){
                    console.error(err);
                }


                chrome.storage.local.set({optionsTable: timeTable, userOptionsTable: userOptionsTable}, function() {
                    console.log("optionsTable set to: ", Object.keys(timeTable), Object.values(timeTable));
                    console.log("userOptionsTable set to: ", Object.keys(userOptionsTable), Object.values(userOptionsTable));
                });
            })
      }else{
          prevStartTime = new Date();   //reset time to not count it
          console.log("not in focus");
      }
}