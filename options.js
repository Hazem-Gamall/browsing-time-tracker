document.addEventListener('DOMContentLoaded', function(){
    var addButton = document.getElementById("addButton");
    var table = new Object();
    addButton.addEventListener('click',function(){
    var input = document.getElementById("input_id").value;
    try{
    var hostname = (new URL(input).hostname);
        
    console.log("hostname: ", hostname);

    console.log("doc", document.body.lastChild);

    var div = document.createElement('div');
    var label = document.createElement("label");
    label.textContent = hostname;

    div.appendChild(label);

    console.log(document.body);
    document.body.insertBefore(div,document.body.lastChild);
    }catch(_){
        console.log("invalid URL");
    }
    
    
});
});
