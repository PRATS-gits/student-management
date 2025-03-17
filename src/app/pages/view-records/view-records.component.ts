import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../components/ui/card/card.component';
import { AlertDialogComponent } from '../../components/ui/alert-dialog/alert-dialog.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-view-records',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonComponent, 
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    AlertDialogComponent
  ],
  template: `
    <div class="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Student Records</h1>
        <p class="text-muted-foreground">
          View and manage all student records
        </p>
      </div>
      
      <app-card class="w-full animate-scale-in glass-card">
        <app-card-header>
          <div class="flex justify-between items-center">
            <div>
              <app-card-title>Student Records</app-card-title>
              <app-card-description>
                {{ students.length === 0
                  ? 'No student records found'
                  : 'Showing ' + filteredStudents.length + ' student records' }}
              </app-card-description>
            </div>
            <app-button 
              variant="outline" 
              (onClick)="exportCSV()"
              [disabled]="filteredStudents.length === 0"
              className="flex items-center gap-1"
            >
              <span>📥</span>
              Export CSV
            </app-button>
          </div>
        </app-card-header>
        
        <app-card-content>
          <div class="flex mb-4">
            <div class="relative w-full">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">🔍</span>
              <app-input
                placeholder="Search by name, roll number, or email"
                [value]="searchQuery"
                (valueChange)="onSearchChange($event)"
                className="pl-9"
              ></app-input>
            </div>
          </div>
          
          <div class="rounded-md border overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b bg-muted/50">
                  <th 
                    class="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                    (click)="handleSort('name')"
                  >
                    <div class="flex items-center">
                      Name
                      <span *ngIf="sortField === 'name'" class="ml-1">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </div>
                  </th>
                  <th class="h-12 px-4 text-left align-middle font-medium">Branch</th>
                  <th class="h-12 px-4 text-left align-middle font-medium">Class</th>
                  <th 
                    class="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                    (click)="handleSort('rollNo')"
                  >
                    <div class="flex items-center">
                      Roll No
                      <span *ngIf="sortField === 'rollNo'" class="ml-1">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </div>
                  </th>
                  <th class="h-12 px-4 text-left align-middle font-medium">Honours</th>
                  <th 
                    class="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                    (click)="handleSort('email')"
                  >
                    <div class="flex items-center">
                      Email
                      <span *ngIf="sortField === 'email'" class="ml-1">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </div>
                  </th>
                  <th class="h-12 px-4 text-right align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="filteredStudents.length === 0">
                  <td colspan="7" class="text-center py-6 text-muted-foreground">
                    No student records found
                  </td>
                </tr>
                <tr *ngFor="let student of sortedStudents" class="border-b hover:bg-muted/50 transition-colors">
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
                        className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        (onClick)="handleDelete(student.id)"
                      >
                        🗑️
                      </app-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </app-card-content>
      </app-card>
      
      <app-alert-dialog
        [open]="!!deleteId"
        title="Confirm Deletion"
        description="Are you sure you want to delete this student record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        [glassEffect]="true"
        (onConfirm)="confirmDelete()"
        (onCancel)="cancelDelete()"
        (openChange)="onAlertDialogOpenChange($event)"
      ></app-alert-dialog>
    </div>
  `
})
export class ViewRecordsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  sortedStudents: Student[] = [];
  searchQuery: string = '';
  sortField: keyof Student = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  deleteId: string | null = null;
  
  constructor(
    private router: Router,
    private studentService: StudentService,
    private toastService: ToastService
  ) {}
  
  ngOnInit(): void {
    this.loadStudents();
    
    // Subscribe to students changes
    this.studentService.students$.subscribe(students => {
      this.students = students;
      this.applyFilters();
    });
    
    // Subscribe to filtered students changes
    this.studentService.filteredStudents$.subscribe(filteredStudents => {
      this.filteredStudents = filteredStudents;
      this.sortStudents();
    });
    
    // Subscribe to search query changes
    this.studentService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
    });
  }
  
  loadStudents(): void {
    this.studentService.loadStudents();
  }
  
  onSearchChange(query: string): void {
    this.studentService.searchStudents(query);
  }
  
  handleSort(field: keyof Student): void {
    if (field === this.sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.sortStudents();
  }
  
  sortStudents(): void {
    this.sortedStudents = [...this.filteredStudents].sort((a, b) => {
      if (a[this.sortField] < b[this.sortField]) return this.sortDirection === 'asc' ? -1 : 1;
      if (a[this.sortField] > b[this.sortField]) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  applyFilters(): void {
    if (this.searchQuery) {
      this.studentService.searchStudents(this.searchQuery);
    } else {
      this.filteredStudents = this.students;
      this.sortStudents();
    }
  }
  
  handleEdit(id: string): void {
    this.router.navigate(['/edit', id]);
  }
  
  handleDelete(id: string): void {
    this.deleteId = id;
  }
  
  confirmDelete(): void {
    if (this.deleteId) {
      const success = this.studentService.deleteStudent(this.deleteId);
      
      if (success) {
        this.toastService.show({
          title: 'Student Deleted',
          description: 'Student record has been deleted successfully',
        });
      }
      
      this.deleteId = null;
    }
  }
  
  cancelDelete(): void {
    this.deleteId = null;
  }
  
  onAlertDialogOpenChange(isOpen: boolean): void {
    if (!isOpen) {
      this.deleteId = null;
    }
  }
  
  exportCSV(): void {
    const headers = ['Name', 'Branch', 'Class', 'Roll No', 'Honours Degree', 'Email'];
    const data = this.sortedStudents.map(student => [
      student.name,
      student.branch,
      student.class,
      student.rollNo.toString(),
      student.honoursDegree,
      student.email
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_records.csv');
    link.click();
    
    this.toastService.show({
      title: 'Data Exported',
      description: 'All student records have been exported to CSV',
    });
  }
}
