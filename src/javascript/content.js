//handle the video events
document.addEventListener("load",() => {
    
})

function definePlayingProperty(){
    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
        get: function(){
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        }
    })
}

function checkVideoPlayback(){
    const videoElement = document.querySelector('video');
    videoElement.playing ?? definePlayingProperty();
    console.log("video status", document.querySelector('video').playing);
    return document.querySelector('video').playing ? "play":"paused"; 
}

function reportVideoStatus(){
    const status = checkVideoPlayback();
    console.log(`video ${status}`);
                try{
                    chrome.runtime.sendMessage(status);
                }catch(e){
                    console.log("Error:", e);
                }
    
}

setInterval(reportVideoStatus, 1000);

