import { renderTable } from "./pages/popup.js";
import { removeAllChildNodes } from "./modules/removeAllChildNode.js";
import { renderWeek } from "./modules/renderWeek.js";
import { renderHistory } from "./pages/history.js";


var currentTarget = "";
var _renderHistory;
const contentElement = document.querySelector('#content');

const navButtons = {
    popup: document.querySelector('[data-target="popup"]'),
    week: document.querySelector('[data-target="week"]'),
    history: document.querySelector('[data-target="history"]'),
}

function renderPopupContent() {
    removeAllChildNodes(contentElement);
    const popupContent = document.querySelector("#popup-content").content.cloneNode(true);
    contentElement.append(popupContent);
    renderTable();
}


function renderWeekContent() {
    removeAllChildNodes(contentElement);
    const weekContent = document.querySelector("#week-content").content.cloneNode(true);
    contentElement.append(weekContent);
    renderWeek();
}


function renderHistoryContent() {
    removeAllChildNodes(contentElement);
    const historyContent = document.querySelector("#history-content").content.cloneNode(true);
    contentElement.append(historyContent);
    // _renderHistory ??= renderHistory();
    // _renderHistory();
    renderHistory()();
}

function setActiveNavButton() {
    console.log({currentTarget});
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
    }
    setActiveNavButton();
}

function handleNavigation() {
    const target = this.dataset.target;
    renderPageContent(target);
}

document.querySelectorAll('.content-nav').forEach((element) => { element.onclick = handleNavigation });

renderPageContent("popup");