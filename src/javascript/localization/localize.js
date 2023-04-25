import { fullLanguageCode } from "./fullLanguageCode.js";

const hour = chrome.i18n.getMessage("h");
const min = chrome.i18n.getMessage("m");
const sec = chrome.i18n.getMessage("s");

function localizeAndFloor(number) {
    return Math.floor(number).toLocaleString(fullLanguageCode.currentLocale);
}

function localizeDate(date){
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(date, options)
}

function localizeHtml(htmlElement){
    Array.from(htmlElement.querySelectorAll('[translate="yes"]')).forEach((element) => element.textContent = chrome.i18n.getMessage(element.dataset.translationKey))
}

export {hour, min, sec, localizeAndFloor, localizeHtml, localizeDate}