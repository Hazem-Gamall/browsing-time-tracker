//handle the video events

var vid = document.getElementsByTagName('video')[0];

if(vid !== undefined){
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
}

