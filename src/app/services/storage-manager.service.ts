import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';
import { StorageService } from './storage.service';
import { StudentService } from './student.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class StorageManagerService {
  constructor(
    private storageService: StorageService,
    private studentService: StudentService,
    private toastService: ToastService
  ) {}

  // Export data to JSON file
  exportDataToJson(): void {
    try {
      const students = this.storageService.getStudents();
      const dataStr = JSON.stringify(students, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = 'student_records.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      this.toastService.show({
        title: 'Data Exported',
        description: 'All student records have been exported to JSON',
      });
    } catch (error) {
      console.error('Failed to export data:', error);
      this.toastService.show({
        title: 'Export Failed',
        description: 'Could not export student records',
        variant: 'destructive'
      });
    }
  }

  // Export data to CSV file
  exportDataToCsv(): void {
    try {
      const students = this.storageService.getStudents();
      
      const headers = ['Name', 'Branch', 'Class', 'Roll No', 'Honours Degree', 'Email'];
      const data = students.map(student => [
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
        title: 'CSV Exported',
        description: 'Student records exported to CSV format',
      });
    } catch (error) {
      console.error('Failed to export CSV:', error);
      this.toastService.show({
        title: 'Export Failed',
        description: 'Could not export student records to CSV',
        variant: 'destructive'
      });
    }
  }

  // Import data from JSON file
  importDataFromJson(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string;
          const students = JSON.parse(content) as Student[];
          
          if (!Array.isArray(students)) {
            this.toastService.show({
              title: 'Import Failed',
              description: 'Invalid data format. Expected an array of students.',
              variant: 'destructive'
            });
            resolve(false);
            return;
          }
          
          // Validate each student
          const isValid = students.every(student => 
            this.validateStudentData(student)
          );
          
          if (!isValid) {
            this.toastService.show({
              title: 'Import Failed',
              description: 'Invalid student data format.',
              variant: 'destructive'
            });
            resolve(false);
            return;
          }
          
          // Clear existing data and import new data
          this.storageService.clearAllData();
          students.forEach(student => {
            this.storageService.addStudent(student);
          });
          
          // Reload students to update state
          this.studentService.loadStudents();
          
          this.toastService.show({
            title: 'Import Successful',
            description: `${students.length} student records imported`,
          });
          
          resolve(true);
        } catch (error) {
          console.error('Failed to import data:', error);
          this.toastService.show({
            title: 'Import Failed',
            description: 'Could not import student records',
            variant: 'destructive'
          });
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        this.toastService.show({
          title: 'Import Failed',
          description: 'Error reading the file',
          variant: 'destructive'
        });
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }
  
  // Validate student data
  private validateStudentData(student: any): boolean {
    return (
      student &&
      typeof student.id === 'string' &&
      typeof student.name === 'string' &&
      typeof student.branch === 'string' &&
      typeof student.class === 'string' &&
      typeof student.rollNo === 'number' &&
      typeof student.honoursDegree === 'string' &&
      typeof student.email === 'string' &&
      typeof student.createdAt === 'string' &&
      typeof student.updatedAt === 'string'
    );
  }
}
