import { renderTable } from "./pages/popup.js";
import { removeAllChildNodes } from "./modules/removeAllChildNode.js";
import { renderHistory } from "./pages/history.js";
import { renderWeekRelativeToHistory } from "./pages/week.js";
import { renderSettings } from "./pages/settings.js";
import { localizeHtml } from "./localization/localize.js";


var currentTarget = "";
const contentElement = document.querySelector('#content');


document.addEventListener("DOMContentLoaded", () => {
    document.body.setAttribute("dir", chrome.i18n.getMessage("@@bidi_dir"));
    document.documentElement.setAttribute("lang", chrome.i18n.getUILanguage());
})

const navButtons = {
    popup: document.querySelector('[data-target="popup"]'),
    week: document.querySelector('[data-target="week"]'),
    history: document.querySelector('[data-target="history"]'),
    settings: document.querySelector('[data-target="settings"]'),
}


function renderPopupContent() {
    removeAllChildNodes(contentElement);
    const popupContent = document.querySelector("#popup-content").content.cloneNode(true);
    contentElement.append(popupContent);
    renderTable()();
}


function renderWeekContent() {
    removeAllChildNodes(contentElement);
    const weekContent = document.querySelector("#week-content").content.cloneNode(true);
    contentElement.append(weekContent);
    renderWeekRelativeToHistory()();
}


function renderHistoryContent() {
    removeAllChildNodes(contentElement);
    const historyContent = document.querySelector("#history-content").content.cloneNode(true);
    contentElement.append(historyContent);

    renderHistory()();
}

function renderSettingsContent() {
    removeAllChildNodes(contentElement);
    const settingsContent = document.querySelector("#settings-content").content.cloneNode(true);
    contentElement.append(settingsContent);

    renderSettings();
}

function setActiveNavButton() {
    console.log({ currentTarget });
    navButtons[currentTarget].classList.add("active");
    Object.keys(navButtons)
        .filter((button_key) => button_key !== currentTarget)
        .forEach((button_key) => navButtons[button_key].classList.remove("active"));
}

function renderPageContent(newTarget) {
    console.log('renderPage');
    if (newTarget === currentTarget)
        return;
    currentTarget = newTarget;
    switch (currentTarget) {
        case "popup":
            renderPopupContent();
            break;
        case "week":
            renderWeekContent();
            break;
        case "history":
            renderHistoryContent();
            break;
        case "settings":
            renderSettingsContent();
            break;
    }
    localizeHtml(document.body);
    setActiveNavButton();
}

function handleNavigation() {
    const target = this.dataset.target;
    renderPageContent(target);
}

document.querySelectorAll('.content-nav').forEach((element) => { element.onclick = handleNavigation });

renderPageContent("popup");