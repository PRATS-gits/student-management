import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../../services/toast.service';
import { FormValidatorService } from '../../../services/form-validator.service';
import { Student } from '../../../models/student.model';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentServiceSpy: jasmine.SpyObj<StudentService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let formValidatorServiceSpy: jasmine.SpyObj<FormValidatorService>;
  
  // Mock student data
  const mockStudent: Student = {
    id: '1',
    name: 'John Doe',
    branch: 'CS',
    class: 'FE',
    rollNo: 101,
    honoursDegree: 'None',
    email: 'john.doe@example.com',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  beforeEach(async () => {
    // Create spies for the services
    studentServiceSpy = jasmine.createSpyObj('StudentService', ['addStudent', 'updateStudent']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    formValidatorServiceSpy = jasmine.createSpyObj('FormValidatorService', [
      'rollNumberValidator', 
      'collegeEmailValidator',
      'getErrorMessage'
    ]);
    
    // Return validators that return null (valid)
    formValidatorServiceSpy.rollNumberValidator.and.returnValue(() => null);
    formValidatorServiceSpy.collegeEmailValidator.and.returnValue(() => null);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: StudentService, useValue: studentServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: FormValidatorService, useValue: formValidatorServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements like custom components
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    fixture.detectChanges();
    expect(component.studentForm).toBeDefined();
    expect(component.studentForm.get('name')).toBeDefined();
    expect(component.studentForm.get('branch')).toBeDefined();
    expect(component.studentForm.get('class')).toBeDefined();
    expect(component.studentForm.get('rollNo')).toBeDefined();
    expect(component.studentForm.get('honoursDegree')).toBeDefined();
    expect(component.studentForm.get('email')).toBeDefined();
  });

  it('should populate form with student data when editing', () => {
    // Set the component to editing mode with student data
    component.isEditing = true;
    component.student = mockStudent;
    
    fixture.detectChanges();
    
    expect(component.studentForm.get('name')?.value).toBe(mockStudent.name);
    expect(component.studentForm.get('branch')?.value).toBe(mockStudent.branch);
    expect(component.studentForm.get('class')?.value).toBe(mockStudent.class);
    expect(component.studentForm.get('rollNo')?.value).toBe(mockStudent.rollNo);
    expect(component.studentForm.get('honoursDegree')?.value).toBe(mockStudent.honoursDegree);
    expect(component.studentForm.get('email')?.value).toBe(mockStudent.email);
  });

  it('should validate fields correctly', () => {
    fixture.detectChanges();
    
    // Initially form should be invalid as required fields are empty
    expect(component.studentForm.valid).toBeFalse();
    
    // Set values for form fields
    component.studentForm.patchValue({
      name: 'Test Student',
      branch: 'CS',
      class: 'FE',
      rollNo: 105,
      honoursDegree: 'None',
      email: 'test.student@example.com'
    });
    
    expect(component.studentForm.valid).toBeTrue();
  });

  it('should call addStudent when submitting a new student', () => {
    fixture.detectChanges();
    studentServiceSpy.addStudent.and.returnValue(true);
    
    // Set values for form fields
    component.studentForm.patchValue({
      name: 'Test Student',
      branch: 'CS',
      class: 'FE',
      rollNo: 105,
      honoursDegree: 'None',
      email: 'test.student@example.com'
    });
    
    component.onSubmit();
    
    expect(studentServiceSpy.addStudent).toHaveBeenCalled();
    expect(studentServiceSpy.updateStudent).not.toHaveBeenCalled();
  });

  it('should call updateStudent when editing existing student', () => {
    // Set the component to editing mode with student data
    component.isEditing = true;
    component.student = mockStudent;
    fixture.detectChanges();
    
    studentServiceSpy.updateStudent.and.returnValue(true);
    
    // Modify some values
    component.studentForm.patchValue({
      name: 'Updated Name',
      email: 'updated.email@example.com'
    });
    
    component.onSubmit();
    
    expect(studentServiceSpy.updateStudent).toHaveBeenCalledWith(
      mockStudent.id,
      jasmine.objectContaining({
        name: 'Updated Name',
        email: 'updated.email@example.com'
      })
    );
    expect(studentServiceSpy.addStudent).not.toHaveBeenCalled();
  });
});
