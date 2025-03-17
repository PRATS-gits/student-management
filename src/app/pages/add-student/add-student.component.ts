import { Component } from '@angular/core';
import { StudentFormComponent } from '../../components/student/student-form/student-form.component';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [StudentFormComponent],
  template: `
    <div class="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Add New Student</h1>
        <p class="text-muted-foreground">
          Register a new student with their academic details
        </p>
      </div>
      
      <app-student-form></app-student-form>
    </div>
  `
})
export class AddStudentComponent {}
