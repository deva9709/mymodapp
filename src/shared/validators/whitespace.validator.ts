import { AbstractControl, ValidatorFn } from '@angular/forms';

export class WhiteSpaceValidators {

  static emptySpace(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value !== undefined && (c.value || '').trim().length === 0) {
        return { 'whitespace': true };
      }
      return null;
    };
  }
}
