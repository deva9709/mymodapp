import { AbstractControl, ValidatorFn } from '@angular/forms';
//Added TimeCheckValidators for start time and end time
export class TimeCheckValidators {
    static getFormattedTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let AmOrPm = hours >= 12 ? 'PM' : 'AM';
        hours = (hours % 12) || 12;
        hours = hours <= 9 ? `0${hours}` : hours;
        return `${hours}:${minutes} ${AmOrPm}`;
    }

    static checkStartTimeWithCurrentTime(startTime: string): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (startTime==='' || Date.parse('01/01/2011 ' + startTime) < Date.parse('01/01/2011 ' + this.getFormattedTime(new Date()))) {
                return { 'startTimeCheck': true };
            }
            return null;
        };
    }
    static checkStartTimeWithEndTime(endTime: string, endMinTime:string) {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (Date.parse('01/01/2011 ' + endTime) < Date.parse('01/01/2011 ' + endMinTime)) {
                return { 'endTimeCheck': true };
            }
            return null;
        };
    }
}