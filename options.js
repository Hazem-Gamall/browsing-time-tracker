var timeTable = new Object();


document.addEventListener('DOMContentLoaded', function(){
    var addButton = document.getElementById("addButton");
    var delButton = document.getElementById("delButton");
    addButton.addEventListener('click', addUrl, false);
    delButton.addEventListener('click', deleteUrl, false);
    restore_options();
},false);



//restore old options when the extension is loaded
function restore_options(){
    chrome.storage.local.get(['optionsTable'], function(data){
        timeTable = data.optionsTable;

        //restore it to the ui
        for(var key in timeTable){
            var div = document.createElement('div');
            var label = document.createElement('label');
            var icon = document.createElement("img");

            icon.setAttribute('src', 'https://www.google.com/s2/favicons?sz=16&domain='+key);  //add fav"icon"
            label.textContent = key;

            div.appendChild(icon);
            div.appendChild(label);
            document.body.insertBefore(div,document.body.lastChild);
        }
        
    
        
    })
}

function addUrl(){    
    var input = document.getElementById("input_id").value;  //get the URL entered in the input field

    try{    //Error Handling for the URL
    var hostname = (new URL(input).hostname);
    timeTable[hostname] = 0;

    //create the new HTML elemnts for the added URL
    var div = document.createElement('div');
    div.id = hostname;  //give it an id to be able to delete later
    var label = document.createElement("label");
    var icon = document.createElement("img");

    label.textContent = hostname;
    icon.setAttribute('src', 'https://www.google.com/s2/favicons?sz=16&domain='+hostname);  //add fav"icon"

    div.appendChild(icon);
    div.appendChild(label);

    document.body.insertBefore(div,document.body.lastChild);
    }catch(_){
        console.log("invalid URL");
    }
    
    //update the optionsTable
    chrome.storage.local.set({optionsTable:timeTable},function(){
    });

}

function deleteUrl(){
    var input = document.getElementById("input_id").value;

    try{
    var hostname = (new URL(input).hostname);
    delete timeTable[hostname];

    document.body.removeChild(hostname);
    

    }catch(_){
        console.log("invalid URL");
    }
    location.reload();
    //update the optionsTable
    chrome.storage.local.set({optionsTable:timeTable},function(){
    });
}