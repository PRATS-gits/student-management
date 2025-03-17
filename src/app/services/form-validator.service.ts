import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {
  constructor() {}
  
  // Roll number validator
  rollNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (value === null || value === undefined || value === '') {
        return null; // Let required validator handle this
      }
      
      if (isNaN(value) || value <= 0) {
        return { invalidRollNumber: true };
      }
      
      return null;
    };
  }
  
  // Email validator with college email format check
  collegeEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null; // Let required validator handle this
      }
      
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      
      if (!emailRegex.test(value)) {
        return { invalidEmail: true };
      }
      
      return null;
    };
  }
  
  // Get error message for form control
  getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.hasError('required')) {
      return `${fieldName} is required`;
    }
    
    if (control.hasError('invalidRollNumber')) {
      return 'Roll number must be a positive number';
    }
    
    if (control.hasError('email') || control.hasError('invalidEmail')) {
      return 'Please enter a valid email address';
    }
    
    if (control.hasError('minlength')) {
      const requiredLength = control.errors['minlength']?.requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters`;
    }
    
    if (control.hasError('maxlength')) {
      const requiredLength = control.errors['maxlength']?.requiredLength;
      return `${fieldName} cannot exceed ${requiredLength} characters`;
    }
    
    return 'Invalid input';
  }
}
