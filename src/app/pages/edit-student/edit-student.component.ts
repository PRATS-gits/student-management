import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { StudentFormComponent } from '../../components/student/student-form/student-form.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    StudentFormComponent, 
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  template: `
    <div class="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <div *ngIf="loading" class="flex justify-center items-center h-[60vh]">
        <div class="text-center">
          <p class="text-muted-foreground">Loading student data...</p>
        </div>
      </div>
      
      <ng-container *ngIf="!loading">
        <div *ngIf="error || !student" class="container max-w-6xl mx-auto px-4 py-8">
          <app-card class="max-w-md mx-auto glass-card animate-scale-in">
            <app-card-header>
              <app-card-title>Error</app-card-title>
              <app-card-description>
                {{ error || 'Unable to load student data' }}
              </app-card-description>
            </app-card-header>
            <app-card-content>
              <app-button (onClick)="navigateToRecords()" className="w-full">
                Return to Records
              </app-button>
            </app-card-content>
          </app-card>
        </div>
        
        <ng-container *ngIf="student">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2">Edit Student</h1>
            <p class="text-muted-foreground">
              Update information for {{ student.name }}
            </p>
          </div>
          
          <app-student-form [student]="student" [isEditing]="true"></app-student-form>
        </ng-container>
      </ng-container>
    </div>
  `
})
export class EditStudentComponent implements OnInit {
  student: Student | undefined;
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.error = 'No student ID provided';
      this.loading = false;
      return;
    }
    
    this.student = this.studentService.getStudentById(id);
    
    if (!this.student) {
      this.error = 'Student not found';
    }
    
    this.loading = false;
  }
  
  navigateToRecords(): void {
    this.router.navigate(['/view']);
  }
}
