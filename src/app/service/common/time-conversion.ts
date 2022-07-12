import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TimeConversion {
  hours: any;
  minutes: any;
  seconds: any;
  constructor() { }    

  getHours(totalSeconds) {
    return this.hours= Math.floor(totalSeconds / (60 * 60));  
  }
  getMinutes(totalSeconds, hours) {
    this.minutes= Math.floor((totalSeconds - hours * (60 * 60)) / 60);
    return (this.minutes < 10 ? '0' : '') + this.minutes;
  }
  getSeconds(totalSeconds, hours, minutes) {
    this.seconds= Math.floor(totalSeconds - hours * (60 * 60) - minutes * 60);
    return (this.seconds < 10 ? '0' : '') + this.seconds;  
  }
  roundOfHours(totalDuration) {
    return Math.ceil(totalDuration / (60 * 60));
  }
  calculatePercentage(total, completed) {
    return 100 - Math.floor(((total - completed) / total) * 100);
  }
}
