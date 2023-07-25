
import {abortSignal} from "../main.js";


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


    setTime( minutes, thisSeconds = 0) {

        this.#miliseconds = (thisSeconds * 1000)+ (minutes * 60 * 1000);

    }

    getDuration() {
        return this.#miliseconds;
    }
    displayTime(curDurationMil = this.#miliseconds) {
        let curDuration = curDurationMil / 1000;
        let curMinutes = Math.floor(curDuration / 60);
        let curSeconds = Math.floor(curDuration % 60);
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
        let end= Date.now() + this.#miliseconds + 1000; /* I add 1 more second, it's not accurate if I dont */
        this.#intervalSet = true;
        this.#theInterval = setInterval(()=>{
            let delta = end - Date.now();
            this.#miliseconds = delta - 1000; /* save the remaining time */
            if(delta < 0) {
                clearInterval(this.#theInterval);
                abortSignal.abort();
            } else {
                this.displayTime(delta);
            }
            
        }, 100);
    }

    PauseTime() {
        if(this.#intervalSet) {
            clearInterval(this.#theInterval);
        }
    }
}