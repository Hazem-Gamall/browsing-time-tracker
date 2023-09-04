import { localizeAndFloor, localizeMessage } from "../localization/localize.js";
import { TrackVideosEnum } from "../modules/enums/TrackVideos.js"


function idleRangeOnInput(e, value) {
    document.querySelector("#idle-time").textContent = idleNumberToTime(value ?? this.value);
}

function initIdleRange(idlePeriod) {
    const idleRange = document.querySelector('#idle-range');
    idleRange.oninput = idleRangeOnInput;
    idleRange.value = secondsToIdleNumbers(idlePeriod);
    idleRangeOnInput(null, secondsToIdleNumbers(idlePeriod));
    idleRange.onchange = function () { chrome.storage.local.set({ idlePeriod: idleNumberToSeconds(this.value) }) };
}



function initTrackVideoSelect(trackVideos) {
    const trackVideoSelect = document.querySelector("#track-video-select");
    trackVideoSelect.value = trackVideos;
    trackVideoSelect.onchange = function () {
        chrome.storage.local.set({ trackVideos: this.value });
    }
}



export async function renderSettings(){
    $('[data-toggle="tooltip"]').tooltip();
    let { trackVideos, idlePeriod } = await chrome.storage.local.get({ trackVideos: TrackVideosEnum.NONE, idlePeriod: 30});
    initIdleRange(idlePeriod);
    initTrackVideoSelect(trackVideos);
}

function idleNumberToTime(number) {
    if (number < 3) //15 or 30 seconds
        return `${localizeAndFloor(number * 15)} ${localizeMessage('seconds')}`;
    else if (number == 3) //1 minutes
        return `${localizeAndFloor(number - 2)} ${localizeMessage('minute')}`;
    else if (number < 8) //2,3,4,5 minutes
        return `${localizeAndFloor(number - 2)} ${localizeMessage('few_minutes')}`;
    else if (number < 18) //10,15,25...55 minutes
        return `${localizeAndFloor((number - 6) * 5)} ${localizeMessage(number === 8 ? 'few_minutes': 'many_minutes')}`;
    else if (number == 18) //1 hour
        return `${localizeAndFloor(number - 17)} ${localizeMessage('hour')}`
    else //2 hours
        return `${localizeAndFloor(number - 17)} ${localizeMessage('hours')}`
}

function idleNumberToSeconds(number) {
    if (number < 3)
        return number * 15;
    else if (number < 8)
        return (number - 2) * 60;
    else if (number < 18)
        return ((number - 6) * 5) * 60; // x - 6 will make it go back to the 2,3,4,... range
                                        // which when multiplied by 5 will give us the correct minutes
                                        // because the steps are multiples of 5.
    else
        return (number - 17) * 60 * 60;
}


function secondsToIdleNumbers(seconds) {
    if (seconds <= 30)
        return seconds / 15;
    else if (seconds <= 300)
        return (seconds / 60) + 2;
    else if (seconds <= 3300) 
        return ((seconds / (60 * 5)) + 6);
    else
        return (seconds / (60 * 60)) + 17;
}

