import { renderWeek } from './modules/renderWeek.js'
import { sortHistory } from './modules/sorting.js';
let index = 0;

let renderHistory = async () => {
    let { history } = await chrome.storage.local.get({ 'history': null });
    let week_title = document.querySelector('#week-title');

    if (history) {
        history = sortHistory(history);
        history['de7k'] = {
            'Fri Jul 01 2022': {
                '192.168.1.1': 18370,
                'business.whatsapp.com': 21618,
                'developer.mozilla.org': 1467,
                'developers.facebook.com': 388466,
                'extensions': 63746,
                'fast.com': 8095,
                'getbootstrap.com': 160529,
                'github.com': 31044,
                'ndpjmleniilehoebcbpkcomfhjnppnlk': 926,
                'newtab': 24159,
                'settings': 4851,
                'www.coursera.org': 1201,
                'www.facebook.com': 98852,
                'www.google.com': 33383,
                'www.messenger.com': 7505,
                'www.wati.io': 1920,
                'www.youtube.com': 5217232
            }
        }
        let history_list = Object.keys(history);
        if (index < history_list.length && index >= 0) {
            week_title.textContent = history_list[index];
            renderWeek(history[history_list[index]]);
            if (index == 0 ) {
                document.querySelector('#left-arrow').disabled = true;
                
            }else{
                document.querySelector('#left-arrow').disabled = false;
            }
            if(index == history_list.length-1){
                document.querySelector('#right-arrow').disabled = true;
            }else{
                document.querySelector('#right-arrow').disabled = false;
            }
        } 
        // for(const week in history){
        //     let week_history_div = document.createElement('div');
        //     week_history_div.innerHTML = 
        //     `
        //     <p>${JSON.stringify(history[week])}</p>
        //     `
        //     console.log(history[week])
        //     week_div.append(week_history_div);
        // }
    }
}

renderHistory();

// document.onload = () => {
document.querySelector('#right-arrow').addEventListener('click',() => {
    index++;
    renderHistory()
})
document.querySelector('#left-arrow').addEventListener('click', () => {
    index--;
    renderHistory();
})

// }
