let videoStatus = "";

function definePlayingProperty(){
    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
        get: function(){
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        }
    })
}

function checkVideoPlayback(){
    const videoElement = document.querySelector('video');
    videoElement?.playing ?? definePlayingProperty();
    return document.querySelector('video').playing ? "play":"paused"; 
}

function reportVideoStatus(){
    const status = checkVideoPlayback()
    if(status === videoStatus)
        return;
    videoStatus = status;
    console.log(`video ${videoStatus}`);
                try{
                    chrome.runtime.sendMessage(videoStatus);
                }catch(e){
                    console.log("Error:", e);
                }
    
}

setInterval(reportVideoStatus, 1000);

