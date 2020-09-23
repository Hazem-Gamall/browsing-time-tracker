var prevStartTime;
var prevHostName;
var tabURL;

chrome.tabs.onActivated.addListener(function(activeInfo){
    var timer = setInterval(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var tabURL = tabs[0].url;
            console.log("url: ", tabURL); 
            try{
                var hostname = (new URL(tabURL).hostname);
                console.log("hostName: ",hostname);

                startTime = new Date();
                console.log("startTime: ", startTime);

                getChromeVar(hostname);

                prevStartTime = startTime;
                prevHostName = hostname;
            }
            catch(err){
                console.error(err);
            }
            
        })},1000);            
    })

    
    


function getChromeVar(hostname){
    chrome.storage.local.get(['optionsTable'], function(data){
        timeTable = data.optionsTable;
        console.log("timeTable now: ", Object.keys(timeTable), Object.values(timeTable));
    });
    calculateTime(hostname, timeTable);
}





function calculateTime(hostname, timeTable){
    if(prevHostName in timeTable){
        endTime = new Date();
        console.log("endTime: ", endTime);
        var dif = endTime - prevStartTime;
        
        // var seconds = Math.round(dif);
        timeTable[prevHostName] += dif;
        console.log(timeTable[prevHostName]);
        var time =  new Date(timeTable[prevHostName]).toISOString().substr(11, 8);
        console.log("time: ", time);

        
 
    chrome.storage.local.set({optionsTable: timeTable}, function() {
        console.log(Object.keys(timeTable));
        console.log(Object.values(timeTable));
        console.log('Value is set to ' + Object.keys(timeTable));
    });

}

}
