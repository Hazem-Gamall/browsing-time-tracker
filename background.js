var timeTable = new Object();
timeTable["www.youtube.com"] = 0;
var prevStartTime;
var prevHostName;
var tabURL;
var time = document.getElementById('date');

function calculateTime(hostname){
    if(prevHostName === "www.youtube.com"){
        endTime = new Date();
        console.log("endTime: ", endTime);
        var dif = endTime - prevStartTime;
        
        // var seconds = Math.round(dif);
        timeTable[prevHostName] += dif;
        console.log(timeTable[prevHostName]);
        var time =  new Date(timeTable[prevHostName]).toISOString().substr(11, 8);
        console.log("time: ", time);

        chrome.storage.local.set({'time': time}, function() {
            console.log('Value is set to ' + time);
          });
        
    }
}

chrome.tabs.onActivated.addListener(function(activeInfo){
    var timer = setInterval(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var tabURL = tabs[0].url;
            console.log("url: ", tabURL);    
            try{
                var hostname = (new URL(tabURL).hostname);
                startTime = new Date();
                console.log("startTime: ", startTime);

                
                
                console.log('before calculate time');
                calculateTime(hostname);
                console.log('after calculate time');

                prevStartTime = startTime;
                prevHostName = hostname;
            }
            catch(err){
                console.error(err);
            }
            
        })},1000);            
    })

    
    