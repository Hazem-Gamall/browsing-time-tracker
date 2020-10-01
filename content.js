var vid = document.getElementsByTagName('video')[0];

vid.addEventListener('progress',function(){
    chrome.runtime.sendMessage('progress');
    // console.log('progress');
});

vid.addEventListener('ended',function(){
    chrome.runtime.sendMessage('ended');
    // console.log('ended');
});
