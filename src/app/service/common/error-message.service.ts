import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  private errorMessageSource = new BehaviorSubject(null);

  errorMessage = this.errorMessageSource.asObservable();

  constructor() { }

  setErrorMessage(errorMessage) {
    this.errorMessageSource.next(errorMessage);
  }
}
