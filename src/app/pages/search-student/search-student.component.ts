import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card/card.component';

@Component({
  selector: 'app-search-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  template: `
    <div class="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Search Students</h1>
        <p class="text-muted-foreground">
          Find students by name, roll number, or email
        </p>
      </div>
      
      <app-card class="w-full animate-scale-in glass-card">
        <app-card-header>
          <app-card-title>Search Students</app-card-title>
          <app-card-description>
            Enter search terms to find specific students
          </app-card-description>
        </app-card-header>
        
        <app-card-content>
          <div class="mb-6">
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">🔍</span>
              <app-input
                [formControl]="searchControl"
                placeholder="Search by name, roll number, or email"
                className="pl-9"
              ></app-input>
            </div>
          </div>
          
          <div *ngIf="loading" class="flex justify-center py-8">
            <div class="text-center">
              <p class="text-muted-foreground">Loading results...</p>
            </div>
          </div>
          
          <div *ngIf="!loading && filteredStudents.length === 0" class="text-center py-8">
            <p class="text-muted-foreground">No students found matching your search criteria.</p>
          </div>
          
          <div *ngIf="!loading && filteredStudents.length > 0" class="rounded-md border overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b bg-muted/50">
                  <th class="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th class="h-12 px-4 text-left align-middle font-medium">Branch</th>
                  <th class="h-12 px-4 text-left align-middle font-medium">Class</th>
                  <th class="h-12 px-4 text-left align-middle font-medium">Roll No</th>
                  <th class="h-12 px-4 text-left align-middle font-medium">Honours</th>
                  <th class="h-12 px-4 text-left align-middle font-medium">Email</th>
                  <th class="h-12 px-4 text-right align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of filteredStudents" class="border-b hover:bg-muted/50 transition-colors">
                  <td class="p-4 align-middle font-medium">{{ student.name }}</td>
                  <td class="p-4 align-middle">{{ student.branch }}</td>
                  <td class="p-4 align-middle">{{ student.class }}</td>
                  <td class="p-4 align-middle">{{ student.rollNo }}</td>
                  <td class="p-4 align-middle">{{ student.honoursDegree }}</td>
                  <td class="p-4 align-middle max-w-[200px] truncate">{{ student.email }}</td>
                  <td class="p-4 align-middle">
                    <div class="flex justify-end gap-2">
                      <app-button
                        variant="outline"
                        className="h-8 w-8"
                        (onClick)="handleEdit(student.id)"
                      >
                        ✏️
                      </app-button>
                      <app-button
                        variant="outline"
                        className="h-8 w-8"
                        (onClick)="viewDetails(student.id)"
                      >
                        👁️
                      </app-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </app-card-content>
      </app-card>
    </div>
  `
})
export class SearchStudentComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  filteredStudents: Student[] = [];
  loading = false;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private router: Router,
    private studentService: StudentService
  ) {}
  
  ngOnInit(): void {
    // Initialize data
    this.studentService.filteredStudents$
      .pipe(takeUntil(this.destroy$))
      .subscribe(students => {
        this.filteredStudents = students;
      });
      
    this.studentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });
      
    // Subscribe to search input changes
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.studentService.searchStudents(query || '');
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  handleEdit(id: string): void {
    this.router.navigate(['/edit', id]);
  }
  
  viewDetails(id: string): void {
    // Navigate to a detailed view of the student
    // For now, let's redirect to edit page
    this.router.navigate(['/edit', id]);
  }
}
