
function getChromeVar(label){
    chrome.storage.local.get(['time'], function(result) {
        label.textContent = result.time;
      });
}

document.addEventListener('DOMContentLoaded', function() {

var refreshButton = document.getElementById('refreshButton');
var timeLabel = document.getElementById('time');

getChromeVar(timeLabel);

refreshButton.addEventListener('click', function(){
    getChromeVar(timeLabel);
})}, false);


