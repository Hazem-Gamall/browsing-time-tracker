

document.addEventListener('DOMContentLoaded', function() {    
        createHTMLFromTable();
}, false);




function createHTMLFromTable(){   
    var page = chrome.extension.getBackgroundPage();
    var trackAll = page.trackAll;
    // console.log("trackAll: ", trackAll);
    if(trackAll){
        var timeTable = page.timeTable;
        
    }else{
        var timeTable = page.userOptionsTable;
    }

    var timeTable = Object.fromEntries(Object.entries(timeTable).sort(([,a],[,b])=>b-a));

    timeTable['totalTime'] = 0;

    // console.log("H: ", Object.keys(timeTable), Object.values(timeTable));
    var websites = 0;
    var i =0;
    for(var key in timeTable){
        if(key === "totalTime" || key === "day" || key === "newtab") continue;
        // console.log("key:",key);
        timeTable["totalTime"] += timeTable[key];
        // console.log("totalTime in loop: ", timeTable["totalTime"]);
        var div = document.createElement('div');
        var label = document.createElement('label');
        var icon = document.createElement('img');   
        
        label.textContent =  (new Date(timeTable[key]).toISOString().substr(11,8));
        icon.setAttribute('src', 'chrome://favicon/https://'+key);   //set icon as website's favicon
        icon.title = key;
        icon.style.marginRight = '5px';


        div.appendChild(icon);
        div.appendChild(label);
        
        document.body.insertBefore(div,document.getElementById("totalTimeText"));
        websites++;
        i++;
    }
    var numberOfWbs = document.getElementById("numberOfWbs");
    numberOfWbs.textContent = websites;
    var totalTimeLabel = document.getElementById("totalTime");
    // console.log("totalTime: ", timeTable["totalTime"]);
    totalTimeLabel.textContent = (new Date(timeTable["totalTime"]).toISOString().substr(11,8));
}



