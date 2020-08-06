/* tslint:disable:variable-name */
export class TaskTime {
    private _hours: number;
    private _minutes: number;
    private _seconds: number;

    constructor(seconds: number) {
        const { hr, min, sec } = this.secondsToTime(seconds);
        this._hours = hr;
        this._minutes = min;
        this._seconds = sec;
    }

    secondsToTime(seconds: number): { hr: number, min: number, sec: number } {
        let hr: number;
        let min: number;
        let sec: number;
        let secondsLeft: number;

        hr = Math.round(seconds / 3600);
        secondsLeft = seconds % 3600;
        min = Math.round(secondsLeft / 60);
        sec = secondsLeft % 60;

        return { hr, min, sec };
    }

    get hours() {
        return this._hours;
    }

    get minutes() {
        return this._minutes;
    }

    get seconds() {
        return this._seconds;
    }
}
