//handle the video events

document.addEventListener("DOMContentLoaded",function(){
    alert("loaded");
})

var vid = document.getElementsByTagName('video')[0];



vid.addEventListener('progress',function(){
    chrome.runtime.sendMessage('progress');
    // console.log('progress');
});    



vid.addEventListener('ended',function(){
    chrome.runtime.sendMessage('ended');
    // console.log('ended');
});


vid.addEventListener('pause',function(){
    chrome.runtime.sendMessage('pause');
    // console.log("pause");
});


vid.addEventListener('play',function(){
    chrome.runtime.sendMessage('play');
    // console.log("play");
});