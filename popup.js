document.addEventListener('DOMContentLoaded', function() {




getChromeVar();

var refreshButton = document.getElementById('refreshButton');


refreshButton.addEventListener('click', function(){
    console.log("hey");
    getChromeVar();
});


}, false);



function getChromeVar(){

    chrome.storage.local.get(['tTable'], function(data) {
        var timeTable = new Object();
        timeTable["www.youtube.com"] = document.getElementById('youtubeTime');
        timeTable["www.facebook.com"] = document.getElementById('facebookTime');
        timeTable["twitter.com"] = document.getElementById('twitterTime');
        timeTable["www.google.com"] = document.getElementById('googleTime');
        timeTable["github.com"] = document.getElementById('githubTime');
        timeTable["stackoverflow.com"] = document.getElementById('stackofTime');

       for(var i =0; i < 7; i++){
           var arr = Object.keys(data.tTable);

           console.log('i', arr[i]);
           timeTable[arr[i]].textContent = new Date(data.tTable[arr[i]]).toISOString().substr(11, 8);
       }
      });
}