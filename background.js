
var prevStartTime;
var prevHostName;
var tabURL;
var timeTable = {};

chrome.tabs.onActivated.addListener(function(activeInfo){
    var timer = setInterval(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var tabURL = tabs[0].url;
            try{
                var hostname = (new URL(tabURL).hostname);

                startTime = new Date();

                getChromeVar(hostname);

                prevStartTime = startTime;
                prevHostName = hostname;
            }
            catch(_){
                console.error(err);
            }
            
        })},100);            
    })

    
    


function getChromeVar(hostname){
    chrome.storage.local.get(['optionsTable'], function(data){
        timeTable = data.optionsTable;
    });
    calculateTime(hostname, timeTable);
}





function calculateTime(hostname, timeTable){
    if(prevHostName in timeTable){
        endTime = new Date();
        var dif = endTime - prevStartTime;
        
        // var seconds = Math.round(dif);
        timeTable[prevHostName] += dif;
        var time =  new Date(timeTable[prevHostName]).toISOString().substr(11, 8);

        
 
    chrome.storage.local.set({optionsTable: timeTable}, function() {

    });

}

}
