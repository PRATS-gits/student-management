import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';

const STORAGE_KEY = 'student-records';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  constructor() { }
  
  // Get all students from localStorage
  getStudents(): Student[] {
    try {
      const studentsJson = localStorage.getItem(STORAGE_KEY);
      return studentsJson ? JSON.parse(studentsJson) : [];
    } catch (error) {
      console.error('Failed to parse students from localStorage:', error);
      return [];
    }
  }
  
  // Get student by ID
  getStudentById(id: string): Student | undefined {
    const students = this.getStudents();
    return students.find(student => student.id === id);
  }
  
  // Save students to localStorage
  saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }
  
  // Add a new student
  addStudent(student: Student): void {
    const students = this.getStudents();
    students.push(student);
    this.saveStudents(students);
  }
  
  // Update an existing student
  updateStudent(updatedStudent: Student): boolean {
    const students = this.getStudents();
    const index = students.findIndex(student => student.id === updatedStudent.id);
    
    if (index !== -1) {
      students[index] = updatedStudent;
      this.saveStudents(students);
      return true;
    }
    return false;
  }
  
  // Delete a student
  deleteStudent(id: string): boolean {
    const students = this.getStudents();
    const filteredStudents = students.filter(student => student.id !== id);
    
    if (filteredStudents.length !== students.length) {
      this.saveStudents(filteredStudents);
      return true;
    }
    return false;
  }
  
  // Search students
  searchStudents(query: string): Student[] {
    if (!query || query.trim() === '') {
      return this.getStudents();
    }
    
    const students = this.getStudents();
    const lowercaseQuery = query.toLowerCase().trim();
    
    return students.filter(student => 
      student.name.toLowerCase().includes(lowercaseQuery) ||
      student.email.toLowerCase().includes(lowercaseQuery) ||
      student.rollNo.toString().includes(lowercaseQuery) ||
      student.branch.toLowerCase().includes(lowercaseQuery) ||
      student.class.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // Check if roll number is unique
  isRollNoUnique(rollNo: number, excludeId?: string): boolean {
    const students = this.getStudents();
    return !students.some(student => 
      student.rollNo === rollNo && (!excludeId || student.id !== excludeId)
    );
  }
  
  // Clear all student data
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
