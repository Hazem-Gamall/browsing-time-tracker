document.addEventListener('DOMContentLoaded', function(){
    var addButton = document.getElementById("addButton");
    var table = new Object();
    addButton.addEventListener('click',function(){
    var input = document.getElementById("input_id").value;
    try{
    var hostname = (new URL(input).hostname);
    table[hostname] = 0;
    console.log("hostname: ", hostname);

    var div = document.createElement('div');
    var label = document.createElement("label");
    label.textContent = hostname;

    div.appendChild(label);

    document.body.insertBefore(div,document.body.lastChild);
    }catch(_){
        console.log("invalid URL");
    }
    
    chrome.storage.local.set({optionsTable:table},function(){
        console.log("set to", Object.keys(table),Object.values(table));
    })
    
});

});
