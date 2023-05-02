const TrackVideosEnum = Object.freeze({
    YOUTUBE: "0",
    ALL: "1",
    NONE: "2"
});

window.onunload = () => { sendMessageToExtension("unload") };
window.onbeforeunload = () => { sendMessageToExtension("before unload") };

function definePlayingProperty() {
    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
        get: function () {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        }
    })
}

function checkVideoPlayback() {
    const videoElements = document.querySelectorAll('video');
    if (!videoElements.length)
        return false;
    const isAnyVideoPlaying = Array.from(videoElements).some((element) => {
        element.playing ?? definePlayingProperty();
        return element.playing;
    });

    return isAnyVideoPlaying ? "play" : "paused";
}

async function reportVideoStatus() {
    try {
        const { trackVideos } = await chrome.storage.local.get({ trackVideos: TrackVideosEnum.NONE })
        const status = checkVideoPlayback();
        if (!document.hasFocus() || trackVideos === TrackVideosEnum.NONE ||
            (document.location.hostname !== "www.youtube.com" && trackVideos === TrackVideosEnum.YOUTUBE)
            || !status)
            return;
        videoStatus = status;
        console.log(`video ${videoStatus}`);
        sendMessageToExtension(videoStatus);

    } catch (e) {
        console.log("Error:", e);
    }

}

function sendMessageToExtension(message) {
    console.log({ message });
    try {
        chrome.runtime.sendMessage(videoStatus);
    } catch (e) {
        console.log("Error:", e);
    }
}

setInterval(reportVideoStatus, 1000);

