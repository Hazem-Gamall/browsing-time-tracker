

$('[data-toggle="tooltip"]').tooltip();

const TrackVideosEnum = Object.freeze({
    YOUTUBE: 0,
    ALL: 1,
    OFF: 2
});


function idleRangeOnInput(e, value) {
    document.querySelector("#idle-time").textContent = idleNumberToTime(value ?? this.value);
}

function initIdleRange(idlePeriod) {
    const idleRange = document.querySelector('#idle-range');
    idleRange.oninput = idleRangeOnInput;
    idleRange.value = secondsToIdleNumbers(idlePeriod);
    idleRangeOnInput(null, secondsToIdleNumbers(idlePeriod));
    idleRange.onchange = function () { chrome.storage.local.set({idlePeriod:this.value}) };
}

function initTrackVideoSelect(trackVideos) {
    const trackVideoSelect = document.querySelector("#track-video-select");
    trackVideoSelect.value = trackVideos;
    trackVideoSelect.onchange = function () { chrome.storage.local.set({trackVideos:this.value}) }

}

function initArabHinduNumeralsInput(arabHinduNumerals) {
    if (chrome.i18n.getUILanguage() !== "ar")
        return;
    const arabHinduNumeralsInput = document.querySelector('#arab-hindu-numerals');
    document.querySelector("#arab-hindu-numerals-div").style.display = "block";
    arabHinduNumeralsInput.checked = arabHinduNumerals;
    arabHinduNumeralsInput.onchange = function () { chrome.storage.local.set({arabHinduNumerals: this.checked}); }
}


document.addEventListener("DOMContentLoaded",
    async () => {
        let { trackVideos, idlePeriod, arabHinduNumerals } = await chrome.storage.local.get({ trackVideos: TrackVideosEnum.YOUTUBE, idlePeriod: 30, arabHinduNumerals: true });
        initIdleRange(idlePeriod);
        initTrackVideoSelect(trackVideos);
        initArabHinduNumeralsInput(arabHinduNumerals);
    }
)

function idleNumberToTime(number) {
    if (number < 3)
        return `${number * 15} seconds`;
    else if (number == 3)
        return `${number - 2} minute`;
    else if (number < 8)
        return `${number - 2} minutes`;
    else if (number < 18)
        return `${(number - 6) * 5} minutes`;
    else if (number == 18)
        return `${number - 17} hour`
    else
        return `${number - 17} hours`
}

function idleNumberToSeconds(number) {
    if (number < 3)
        return number * 15;
    else if (number < 8)
        return (number - 2) * 60;
    else if (number < 18)
        return ((number - 6) * 5) * 60;
    else
        return (number - 17) * 60 * 60;
}


function secondsToIdleNumbers(seconds) {
    if (seconds <= 30)
        return seconds / 15;
    else if (seconds <= 300)
        return (seconds / 60) + 2;
    else if (seconds < 18)
        return ((seconds / (60 * 5)) + 6);
    else
        return (seconds / (60 * 60)) + 17;
}


// new HTMLInputElement().