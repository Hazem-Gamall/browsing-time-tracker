

document.addEventListener('DOMContentLoaded', function() {    
    var timer = setInterval(function(){
        getChromeVar();
    },1000)
    
    
    
}, false);





function createHtmlFromTable(timeTable){
    document.body.innerHTML = '';   //clear the already made elemnets (needs a better solution)
    
    for(var key in timeTable){
        var div = document.createElement('div');
        var label = document.createElement('label');
        var icon = document.createElement('img');   

        label.textContent = (new Date(timeTable[key]).toISOString().substr(11,8));
        icon.setAttribute('src', 'https://www.google.com/s2/favicons?sz=16&domain='+key);   //set icon as website's favicon
        icon.style.marginRight = '5px';

        div.appendChild(icon);
        div.appendChild(label);

        var div1 = document.getElementById('div1');

        document.body.insertBefore(div, div1)
    }
}


function getChromeVar(){
    var timeTable = new Object();
    chrome.storage.local.get(['optionsTable'], function(result) {
        timeTable = result.optionsTable;
        console.log("timeTable: ", Object.keys(timeTable), Object.values(timeTable));   
        createHtmlFromTable(timeTable);
    });
}