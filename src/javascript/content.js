//handle the video events

window.addEventListener('yt-page-data-updated', function () {
    console.log('url change');
    console.log('hello there')
    var vid = document.getElementsByTagName('video')[0];

    if(vid){
        let vid_event_handler = (message) => 
            () => {
                console.log(`video ${message}`);
                chrome.runtime.sendMessage(message);
            }
        
        vid.onpause = vid_event_handler('pause');
        vid.onplay = vid_event_handler('play');
        vid.onplaying = vid_event_handler('play');
        vid.onabort = vid_event_handler('abort');
        vid.onended = vid_event_handler('ended');

    }

});

