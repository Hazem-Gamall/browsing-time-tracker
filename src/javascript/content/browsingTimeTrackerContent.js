
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
        return element.playing
    });

    return isAnyVideoPlaying;
}

function reportVideoStatus() {
    if (!document.hasFocus())
        return;
    const status = checkVideoPlayback() ? "play" : "paused";
    videoStatus = status;
    console.log(`video ${videoStatus}`);
    sendMessageToExtension(videoStatus);

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

