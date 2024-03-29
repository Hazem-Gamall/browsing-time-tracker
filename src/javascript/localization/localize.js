import { fullLanguageCode } from "./fullLanguageCode.js";

const hour = localizeMessage("h");
const min = localizeMessage("m");
const sec = localizeMessage("s");

function localizeMessage(message, options){
    return chrome.i18n.getMessage(message, options);
}

function localizeAndFloor(number) {
    return Math.floor(number).toLocaleString(fullLanguageCode.currentLocale);
}

function localizeDate(date){
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(date, options)
}

function localizeHtml(htmlElement){
    Array.from(htmlElement.querySelectorAll('[translate="yes"]')).forEach((element) => element.textContent = localizeMessage(element.dataset.translationKey))
    Array.from(htmlElement.querySelectorAll('[data-translate-title="yes"]')).forEach((element) => {element.title = localizeMessage(element.dataset.titleTranslationKey); $(element).tooltip()})
    Array.from(htmlElement.querySelectorAll('[translate-href]')).forEach((element) => element.href = localizeMessage(element.dataset.hrefTranslationKey))
}

export {hour, min, sec, localizeAndFloor, localizeHtml, localizeDate, localizeMessage}