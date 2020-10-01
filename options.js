


chrome.runtime.sendMessage("runContentScript");

var timeTable = {};
document.addEventListener('DOMContentLoaded', function(){
    
    var checkbox = document.getElementById("checkbox_id");
    checkbox.addEventListener('click',function(){
        var input = document.getElementById("input_id")
        if(checkbox.checked === true){
            input.disabled = true;

        }else{
            input.disabled = false;
        }
        chrome.storage.local.set({trackAll:checkbox.checked},function(){
        });
    })
    

    restore_options();
    var addButton = document.getElementById("addButton");
    var delButton = document.getElementById("delButton");
    addButton.addEventListener('click', addUrl, false);
    delButton.addEventListener('click', deleteUrl, false);

},false);



//restore old options when the extension is loaded
function restore_options(){
    chrome.storage.local.get(['userOptionsTable','trackAll'], function(data){
        if(!data.userOptionsTable) return;
        timeTable = data.userOptionsTable;
        

        //restore it to the ui
        for(var key in timeTable){
            if(key === "totalTime" || key === "day")continue;
            var div = document.createElement('div');
            var label = document.createElement('label');
            var icon = document.createElement("img");

            icon.setAttribute('src', 'chrome://favicon/https://'+key);  //add fav"icon"
            label.textContent = key;

            div.appendChild(icon);
            div.appendChild(label);
            document.body.appendChild(div);
        }
        var checkbox = document.getElementById("checkbox_id");
        checkbox.checked = data.trackAll;
    
        
    });
}
function addUrl(){    
    var input = document.getElementById("input_id").value;  //get the URL entered in the input field

    try{    //Error Handling for the URL
    var hostname = (new URL(input).hostname); 
    timeTable[hostname] = 0;
    // console.log("timeTable: ", Object.keys(timeTable), Object.values(timeTable));

    //create the new HTML elemnts for the added URL
    var div = document.createElement('div');
    div.id = hostname;  //give it an id to be able to delete later
    var label = document.createElement("label");
    var icon = document.createElement("img");

    label.textContent = hostname;
    icon.setAttribute('src', 'https://www.google.com/s2/favicons?sz=16&domain='+hostname);  //add fav"icon"

    div.appendChild(icon);
    div.appendChild(label);
    
    document.body.appendChild(div);
    }catch(err){
        console.log(err);
    }
    
    // update the optionsTable
    chrome.storage.local.set({optionsTable:timeTable},function(){
        // console.log("timeTable set to: ", Object.keys(timeTable), Object.values(timeTable));
    });
    chrome.storage.local.set({userOptionsTable:timeTable},function(){
        // console.log("timeTable set to: ", Object.keys(timeTable), Object.values(timeTable));
    });
    

}

function deleteUrl(){
    var input = document.getElementById("input_id").value;

    try{
    var hostname = (new URL(input).hostname);
    delete timeTable[hostname];

    document.body.removeChild(document.getElementById(hostname));

    

    }catch(err){
        console.log(err);
    }
    //update the optionsTable
    chrome.storage.local.set({optionsTable:timeTable},function(){
    });
    chrome.storage.local.set({userOptionsTable:timeTable},function(){
    });
}