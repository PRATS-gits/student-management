import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Student, Branch, Class, HonoursDegree } from '../../../models/student.model';
import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../../services/toast.service';
import { FormValidatorService } from '../../../services/form-validator.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';
import { LabelComponent } from '../../ui/label/label.component';
import { SelectComponent, OptionComponent } from '../../ui/select/select.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent } from '../../ui/card/card.component';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    InputComponent,
    LabelComponent,
    SelectComponent,
    OptionComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent
  ],
  template: `
    <app-card class="w-full max-w-md mx-auto animate-scale-in glass-card hover:shadow-lg">
      <app-card-header>
        <app-card-title>{{ isEditing ? 'Edit Student' : 'Add New Student' }}</app-card-title>
        <app-card-description>
          {{ isEditing ? 'Update the student information' : 'Enter the details of the new student' }}
        </app-card-description>
      </app-card-header>
      
      <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
        <app-card-content class="space-y-5">
          <div class="space-y-2.5">
            <app-label htmlFor="name">Full Name</app-label>
            <app-input 
              formControlName="name"
              [className]="isFieldInvalid('name') ? 'border-destructive' : ''"
              placeholder="Enter student name">
            </app-input>
            <p *ngIf="isFieldInvalid('name')" 
               class="text-sm text-destructive mt-1">
              {{ getErrorMessage('name') }}
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-2.5">
              <app-label htmlFor="branch">Branch</app-label>
              <app-select formControlName="branch">
                @for (branch of branches; track branch) {
                  <app-option [value]="branch">{{ branch }}</app-option>
                }
              </app-select>
            </div>
            
            <div class="space-y-2.5">
              <app-label htmlFor="class">Class</app-label>
              <app-select formControlName="class">
                @for (classOption of classes; track classOption) {
                  <app-option [value]="classOption">{{ classOption }}</app-option>
                }
              </app-select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-2.5">
              <app-label htmlFor="rollNo">Roll No.</app-label>
              <app-input
                type="number"
                formControlName="rollNo"
                [className]="isFieldInvalid('rollNo') ? 'border-destructive' : ''"
                placeholder="Enter roll number">
              </app-input>
              <p *ngIf="isFieldInvalid('rollNo')" 
                 class="text-sm text-destructive mt-1">
                {{ getErrorMessage('rollNo') }}
              </p>
            </div>
            
            <div class="space-y-2.5">
              <app-label htmlFor="honoursDegree">Honours Degree</app-label>
              <app-select formControlName="honoursDegree">
                @for (degree of honoursDegrees; track degree) {
                  <app-option [value]="degree">{{ degree }}</app-option>
                }
              </app-select>
            </div>
          </div>
          
          <div class="space-y-2.5">
            <app-label htmlFor="email">College Email</app-label>
            <app-input
              type="email"
              formControlName="email"
              [className]="isFieldInvalid('email') ? 'border-destructive' : ''"
              placeholder="Enter college email">
            </app-input>
            <p *ngIf="isFieldInvalid('email')" 
               class="text-sm text-destructive mt-1">
              {{ getErrorMessage('email') }}
            </p>
          </div>
        </app-card-content>
        
        <app-card-footer class="flex justify-between pt-2">
          <app-button 
            type="button" 
            variant="outline" 
            (onClick)="navigateToView()"
          >
            Cancel
          </app-button>
          <app-button 
            type="submit" 
            [disabled]="studentForm.invalid || studentForm.pristine || isSubmitting">
            {{ isEditing ? 'Update Student' : 'Add Student' }}
          </app-button>
        </app-card-footer>
      </form>
    </app-card>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    form {
      transition: all 0.3s ease;
    }
  `]
})
export class StudentFormComponent implements OnInit, OnDestroy {
  @Input() student?: Student;
  @Input() isEditing = false;
  
  studentForm!: FormGroup;
  isSubmitting = false;
  
  branches: Branch[] = ['CS', 'IT', 'EXTC', 'ECS', 'ELEC', 'Mech'];
  classes: Class[] = ['FE', 'SE', 'TE', 'BE'];
  honoursDegrees: HonoursDegree[] = ['None', 'Data Science', 'AI&ML', 'Robotics', 'IoT'];
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastService: ToastService,
    private formValidator: FormValidatorService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initializeForm();
    
    if (this.isEditing && this.student) {
      this.studentForm.patchValue({
        name: this.student.name,
        branch: this.student.branch,
        class: this.student.class,
        rollNo: this.student.rollNo,
        honoursDegree: this.student.honoursDegree,
        email: this.student.email
      });
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  initializeForm(): void {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      branch: ['CS', [Validators.required]],
      class: ['FE', [Validators.required]],
      rollNo: [null, [
        Validators.required,
        this.formValidator.rollNumberValidator()
      ]],
      honoursDegree: ['None', [Validators.required]],
      email: ['', [
        Validators.required, 
        Validators.email, 
        this.formValidator.collegeEmailValidator()
      ]]
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.studentForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  getErrorMessage(fieldName: string): string {
    const control = this.studentForm.get(fieldName);
    return this.formValidator.getErrorMessage(control, fieldName);
  }
  
  onSubmit(): void {
    if (this.studentForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.studentForm.controls).forEach(key => {
        const control = this.studentForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    const formData = this.studentForm.value;
    let success: boolean;
    
    try {
      if (this.isEditing && this.student) {
        success = this.studentService.updateStudent(this.student.id, formData);
      } else {
        success = this.studentService.addStudent(formData);
      }
      
      if (success) {
        this.router.navigate(['/view']);
      }
    } finally {
      this.isSubmitting = false;
    }
  }
  
  navigateToView(): void {
    this.router.navigate(['/view']);
  }
}
