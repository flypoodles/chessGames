


export class Timer {
    #htmlText;
    #miliseconds;
    #theInterval;
    #intervalSet;



    constructor (thisText) {
        this.#htmlText = thisText;
        this.#miliseconds = 0;
        this.#intervalSet = false;
    }


    setTime(thisSeconds, minutes = 0) {

        this.#miliseconds = (thisSeconds * 1000)+ (minutes * 60 * 1000);

    }

    displayTime(curDuration) {
        let curMinutes = curDuration / 60;
        let curSeconds = curDuration % 60;
        let timeString = "";
        if (curMinutes > 9) {
            timeString = curMinutes + ":";
        } else {
            timeString = "0" + curMinutes+ ":";
        }

        if (curSeconds > 9) {
            timeString += curSeconds;
        } else {
            timeString += "0" + curSeconds;
        }

        this.#htmlText.innerText = timeString;
    }

    startTime() {
        let end= Date.now() + this.#miliseconds;
        this.#intervalSet = true;
        this.#theInterval = setInterval(()=>{
            let delta = this.#end - Date.now();
            this.displayTime(delta);
        }, 100);
    }

    PauseTime() {
        if(this.#intervalSet) {
            clearInterval(this.#theInterval);
        }
    }
}