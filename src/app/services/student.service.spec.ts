import { TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { Student } from '../models/student.model';

describe('StudentService', () => {
  let studentService: StudentService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      branch: 'CS',
      class: 'FE',
      rollNo: 101,
      honoursDegree: 'None',
      email: 'john.doe@example.com',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      branch: 'IT',
      class: 'SE',
      rollNo: 102,
      honoursDegree: 'AI&ML',
      email: 'jane.smith@example.com',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', [
      'getStudents',
      'addStudent',
      'updateStudent',
      'deleteStudent',
      'searchStudents',
      'isRollNoUnique',
      'getStudentById',
      'clearAllData'
    ]);
    
    const toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        StudentService,
        { provide: StorageService, useValue: storageSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    studentService = TestBed.inject(StudentService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    
    // Mock the initial data load
    storageServiceSpy.getStudents.and.returnValue(mockStudents);
  });

  it('should be created', () => {
    expect(studentService).toBeTruthy();
  });

  it('should load students from storage service', () => {
    studentService.loadStudents();
    expect(storageServiceSpy.getStudents).toHaveBeenCalled();
    studentService.students$.subscribe(students => {
      expect(students).toEqual(mockStudents);
    });
  });

  it('should add a new student', () => {
    // Arrange
    const newStudent = {
      name: 'New Student',
      branch: 'CS' as const,
      class: 'FE' as const,
      rollNo: 103,
      honoursDegree: 'None' as const,
      email: 'new.student@example.com'
    };
    storageServiceSpy.isRollNoUnique.and.returnValue(true);
    
    // Act
    const result = studentService.addStudent(newStudent);
    
    // Assert
    expect(result).toBeTrue();
    expect(storageServiceSpy.addStudent).toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalled();
  });

  it('should not add student with duplicate roll number', () => {
    // Arrange
    const newStudent = {
      name: 'Duplicate Student',
      branch: 'CS' as const,
      class: 'FE' as const,
      rollNo: 101, // Same as existing student
      honoursDegree: 'None' as const,
      email: 'duplicate@example.com'
    };
    storageServiceSpy.isRollNoUnique.and.returnValue(false);
    
    // Act
    const result = studentService.addStudent(newStudent);
    
    // Assert
    expect(result).toBeFalse();
    expect(storageServiceSpy.addStudent).not.toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalled();
  });

  it('should search students', () => {
    // Arrange
    const searchResults = [mockStudents[0]];
    storageServiceSpy.searchStudents.and.returnValue(searchResults);
    
    // Act
    studentService.searchStudents('John');
    
    // Assert
    expect(storageServiceSpy.searchStudents).toHaveBeenCalledWith('John');
    studentService.filteredStudents$.subscribe(students => {
      expect(students).toEqual(searchResults);
    });
  });

  it('should get student by id', () => {
    // Arrange
    storageServiceSpy.getStudentById.and.returnValue(mockStudents[0]);
    
    // Act
    const result = studentService.getStudentById('1');
    
    // Assert
    expect(storageServiceSpy.getStudentById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockStudents[0]);
  });
});
