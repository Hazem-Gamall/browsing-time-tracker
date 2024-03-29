import { localizeAndFloor } from "../localization/localize.js";

function numberAnimation(){
    let nums = document.querySelectorAll('.num');
    if (nums) {
        nums.forEach((num_element) => {
            let startValue = 0;
            let endValue = parseInt(num_element.dataset.number);
            num_element.textContent = 0;
            let interval = 1500
            let duration = Math.floor(interval / endValue);
            if (!isNaN(endValue)) {
                let counter = setInterval(() => {
                    if (startValue < endValue) {
                        startValue += 1;
                        num_element.textContent = localizeAndFloor(startValue)
                    } else {
                        clearInterval(counter);
                    }
                }, duration)
            }
        })
    }
}

export {numberAnimation}