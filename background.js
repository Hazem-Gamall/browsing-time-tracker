
var prevStartTime;
var prevHostName;
var tabURL;
var timeTable = {};
timeTable['totalTime'] = 0;


chrome.storage.onChanged.addListener(function(changes, namespace){
    for(var key in changes){
        console.log("key: ", key,"changes: ", changes[key]);
        timeTable = changes[key].newValue;
        console.log("timeTable Now: ", Object.keys(timeTable), Object.values(timeTable));
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo){ 
    chrome.storage.local.get(['optionsTable'], function(data){
        timeTable = data.optionsTable;
        console.log("timeTable: ", Object.keys(timeTable), Object.values(timeTable));
    });
    
    var timer = setInterval(function(){
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var tabURL = tabs[0].url;
            try{
                var hostname = (new URL(tabURL).hostname);

                startTime = new Date();

                calculateTime(timeTable);

                prevStartTime = startTime;
                prevHostName = hostname;
            }
            catch(err){
                console.error(err);
            }
            
            chrome.storage.local.set({optionsTable: timeTable}, function() {
                console.log("optionsTable set to: ", Object.keys(timeTable), Object.values(timeTable));
        });
        })},900);            

    //     chrome.storage.local.set({optionsTable: timeTable}, function() {
    //         console.log("optionsTable set to: ", Object.keys(timeTable), Object.values(timeTable));
    // });
    }
    
    );



function calculateTime(timeTable){
    if(prevHostName in timeTable){
        endTime = new Date();
        var dif = endTime - prevStartTime;
        
        // var seconds = Math.round(dif);
        timeTable[prevHostName] += dif;
        console.log(timeTable[prevHostName]);
        
    // chrome.storage.local.set({optionsTable: timeTable}, function() {
    // });

}

}
