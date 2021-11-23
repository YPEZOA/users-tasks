import { Injectable } from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  validateEqualsPassword(password: string, password2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {

      const pass1 = formGroup.get(password)?.value;
      const pass2 = formGroup.get(password2)?.value;
      if (pass1 !== pass2) {
        formGroup.get(password2)?.setErrors({notEquals: true})
          return {notEquals: true}
      }
      formGroup.get('pass2')?.setErrors(null);
      return null;
    }
  }
}
