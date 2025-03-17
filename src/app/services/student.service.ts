import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student, StudentFormData, StudentState } from '../models/student.model';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Initial state
  private initialState: StudentState = {
    students: [],
    filteredStudents: [],
    loading: true,
    searchQuery: ''
  };
  
  // BehaviorSubject to track student state
  private state = new BehaviorSubject<StudentState>(this.initialState);
  
  // Observables for components to subscribe to
  students$: Observable<Student[]> = this.state.pipe(map(state => state.students));
  filteredStudents$: Observable<Student[]> = this.state.pipe(map(state => state.filteredStudents));
  loading$: Observable<boolean> = this.state.pipe(map(state => state.loading));
  searchQuery$: Observable<string> = this.state.pipe(map(state => state.searchQuery));
  
  constructor(
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.loadStudents();
  }
  
  // Load students from storage
  loadStudents(): void {
    try {
      const students = this.storageService.getStudents();
      this.updateState({
        students,
        filteredStudents: students,
        loading: false,
        searchQuery: ''
      });
    } catch (error) {
      console.error('Failed to load students:', error);
      this.toastService.show({
        title: 'Error',
        description: 'Failed to load student records',
        variant: 'destructive'
      });
      this.updateState({
        ...this.state.value,
        loading: false
      });
    }
  }
  
  // Add a new student
  addStudent(data: StudentFormData): boolean {
    try {
      // Validate roll number uniqueness
      if (!this.storageService.isRollNoUnique(data.rollNo)) {
        this.toastService.show({
          title: 'Error',
          description: 'Roll number must be unique',
          variant: 'destructive'
        });
        return false;
      }
      
      // Create new student object
      const newStudent: Student = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to storage
      this.storageService.addStudent(newStudent);
      
      // Update state
      const currentStudents = this.state.value.students;
      this.updateState({
        ...this.state.value,
        students: [...currentStudents, newStudent],
        filteredStudents: this.state.value.searchQuery
          ? this.storageService.searchStudents(this.state.value.searchQuery)
          : [...currentStudents, newStudent]
      });
      
      this.toastService.show({
        title: 'Success',
        description: 'Student added successfully'
      });
      
      return true;
    } catch (error) {
      console.error('Failed to add student:', error);
      this.toastService.show({
        title: 'Error',
        description: 'Failed to add student',
        variant: 'destructive'
      });
      return false;
    }
  }
  
  // Update an existing student
  updateStudent(id: string, data: StudentFormData): boolean {
    try {
      // Validate roll number uniqueness
      if (!this.storageService.isRollNoUnique(data.rollNo, id)) {
        this.toastService.show({
          title: 'Error',
          description: 'Roll number must be unique',
          variant: 'destructive'
        });
        return false;
      }
      
      const studentToUpdate = this.state.value.students.find(s => s.id === id);
      
      if (!studentToUpdate) {
        this.toastService.show({
          title: 'Error',
          description: 'Student not found',
          variant: 'destructive'
        });
        return false;
      }
      
      const updatedStudent: Student = {
        ...data,
        id,
        createdAt: studentToUpdate.createdAt,
        updatedAt: new Date().toISOString()
      };
      
      // Update in storage
      const success = this.storageService.updateStudent(updatedStudent);
      
      if (!success) {
        this.toastService.show({
          title: 'Error',
          description: 'Failed to update student',
          variant: 'destructive'
        });
        return false;
      }
      
      // Update state
      this.updateState({
        ...this.state.value,
        students: this.state.value.students.map(s => s.id === id ? updatedStudent : s),
        filteredStudents: this.state.value.searchQuery
          ? this.storageService.searchStudents(this.state.value.searchQuery)
          : this.state.value.students.map(s => s.id === id ? updatedStudent : s)
      });
      
      this.toastService.show({
        title: 'Success',
        description: 'Student updated successfully'
      });
      
      return true;
    } catch (error) {
      console.error('Failed to update student:', error);
      this.toastService.show({
        title: 'Error',
        description: 'Failed to update student',
        variant: 'destructive'
      });
      return false;
    }
  }
  
  // Delete a student
  deleteStudent(id: string): boolean {
    try {
      // Delete from storage
      const success = this.storageService.deleteStudent(id);
      
      if (!success) {
        this.toastService.show({
          title: 'Error',
          description: 'Student not found',
          variant: 'destructive'
        });
        return false;
      }
      
      // Update state
      const updatedStudents = this.state.value.students.filter(s => s.id !== id);
      this.updateState({
        ...this.state.value,
        students: updatedStudents,
        filteredStudents: this.state.value.searchQuery
          ? this.storageService.searchStudents(this.state.value.searchQuery)
          : updatedStudents
      });
      
      this.toastService.show({
        title: 'Success',
        description: 'Student deleted successfully'
      });
      
      return true;
    } catch (error) {
      console.error('Failed to delete student:', error);
      this.toastService.show({
        title: 'Error',
        description: 'Failed to delete student',
        variant: 'destructive'
      });
      return false;
    }
  }
  
  // Search students
  searchStudents(query: string): void {
    const filteredStudents = this.storageService.searchStudents(query);
    this.updateState({
      ...this.state.value,
      filteredStudents,
      searchQuery: query
    });
  }
  
  // Clear all student data
  clearAllData(): void {
    try {
      this.storageService.clearAllData();
      this.updateState({
        students: [],
        filteredStudents: [],
        loading: false,
        searchQuery: ''
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
      this.toastService.show({
        title: 'Error',
        description: 'Failed to clear student data',
        variant: 'destructive'
      });
    }
  }
  
  // Export student data as JSON
  exportStudentData(): string {
    try {
      return JSON.stringify(this.state.value.students, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      this.toastService.show({
        title: 'Error',
        description: 'Failed to export student data',
        variant: 'destructive'
      });
      return '';
    }
  }
  
  // Get student by ID
  getStudentById(id: string): Student | undefined {
    return this.storageService.getStudentById(id);
  }
  
  // Helper method to update state
  private updateState(state: StudentState): void {
    this.state.next(state);
  }
}
