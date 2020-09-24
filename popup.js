

document.addEventListener('DOMContentLoaded', function() {    
    getChromeVar();
    
}, false);


var page = chrome.extension.getBackgroundPage();
var timeTable = page.timeTable;
console.log("tb: ",tb, Object.keys(tb));


function createHTMLFromTable(timeTable){    
    for(var key in timeTable){
        var div = document.createElement('div');
        var label = document.createElement('label');
        var icon = document.createElement('img');   
        
        label.textContent =  (new Date(timeTable[key]).toISOString().substr(11,8));
        icon.setAttribute('src', 'https://www.google.com/s2/favicons?sz=16&domain='+key);   //set icon as website's favicon
        icon.style.marginRight = '5px';

        // console.log(label.textContent);

        div.appendChild(icon);
        div.appendChild(label);

        document.body.appendChild(div);
    }
}



function getChromeVar(){
    // var timeTable = new Object();
    // chrome.storage.local.get(['optionsTable'], function(result) {
        // timeTable = result.optionsTable;
        createHTMLFromTable(timeTable);
    // });
}

