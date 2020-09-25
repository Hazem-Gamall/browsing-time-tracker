

document.addEventListener('DOMContentLoaded', function() {    
        createHTMLFromTable();
}, false);




function createHTMLFromTable(){   
    var page = chrome.extension.getBackgroundPage();
    var timeTable = page.timeTable;

    timeTable['totalTime'] = 0;

    console.log("H: ", Object.keys(timeTable));
    for(var key in timeTable){
        if(key === "totalTime") continue;
        timeTable["totalTime"] += timeTable[key];
        console.log("totalTime in loop: ", timeTable["totalTime"]);
        var div = document.createElement('div');
        var label = document.createElement('label');
        var icon = document.createElement('img');   
        
        label.textContent =  (new Date(timeTable[key]).toISOString().substr(11,8));
        icon.setAttribute('src', 'https://www.google.com/s2/favicons?sz=16&domain='+key);   //set icon as website's favicon
        icon.style.marginRight = '5px';


        div.appendChild(icon);
        div.appendChild(label);
        
        document.body.insertBefore(div,document.getElementById("totalTimeText"));
    }
    var totalTimeLabel = document.getElementById("totalTime");
    console.log("totalTime: ", timeTable["totalTime"]);
    totalTimeLabel.textContent = (new Date(timeTable["totalTime"]).toISOString().substr(11,8));
}



