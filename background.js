var timeTable = new Object();
timeTable["www.youtube.com"] = 0;
timeTable["www.facebook.com"] = 0;
timeTable["twitter.com"] = 0;
timeTable["stackoverflow.com"] = 0;
timeTable["www.google.com"] = 0;
timeTable["github.com"] = 0;

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

        
    }else if(prevHostName === "www.facebook.com"){
        endTime = new Date();
        console.log("endTime: ", endTime);
        var dif = endTime - prevStartTime;
        
        // var seconds = Math.round(dif);
        timeTable[prevHostName] += dif;
        console.log(timeTable[prevHostName]);
        var time =  new Date(timeTable[prevHostName]).toISOString().substr(11, 8);
        console.log("time: ", time);

    }else if(prevHostName === "stackoverflow.com"){
        endTime = new Date();
        console.log("endTime: ", endTime);
        var dif = endTime - prevStartTime;
        
        // var seconds = Math.round(dif);
        timeTable[prevHostName] += dif;
        console.log(timeTable[prevHostName]);
        var time =  new Date(timeTable[prevHostName]).toISOString().substr(11, 8);
        console.log("time: ", time);


    }else if(prevHostName === "www.google.com"){
        endTime = new Date();
        console.log("endTime: ", endTime);
        var dif = endTime - prevStartTime;
        
        // var seconds = Math.round(dif);
        timeTable[prevHostName] += dif;
        console.log(timeTable[prevHostName]);
        var time =  new Date(timeTable[prevHostName]).toISOString().substr(11, 8);
        console.log("time: ", time);


    }else if(prevHostName === "github.com"){
        endTime = new Date();
        console.log("endTime: ", endTime);
        var dif = endTime - prevStartTime;
        
        // var seconds = Math.round(dif);
        timeTable[prevHostName] += dif;
        console.log(timeTable[prevHostName]);
        var time =  new Date(timeTable[prevHostName]).toISOString().substr(11, 8);
        console.log("time: ", time);

        
    }

    chrome.storage.local.set({tTable: timeTable}, function() {
        console.log(Object.keys(timeTable));
        console.log(Object.values(timeTable));
        console.log('Value is set to ' + Object.keys(timeTable));
    });

}

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

    
    