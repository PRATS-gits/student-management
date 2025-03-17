import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Student } from '../models/student.model';

describe('StorageService', () => {
  let service: StorageService;
  let mockStudents: Student[];
  
  const STORAGE_KEY = 'student-records';

  // Spy on local storage
  let localStorageSpy: any;
  
  beforeEach(() => {
    mockStudents = [
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
    
    // Create localStorage spy before each test
    localStorageSpy = {
      getItem: jasmine.createSpy('getItem').and.callFake(
        (key: string) => key === STORAGE_KEY ? JSON.stringify(mockStudents) : null
      ),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };
    
    spyOn(window.localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(window.localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(window.localStorage, 'removeItem').and.callFake(localStorageSpy.removeItem);
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get students from localStorage', () => {
    const result = service.getStudents();
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    expect(result).toEqual(mockStudents);
  });

  it('should add a new student to localStorage', () => {
    const newStudent: Student = {
      id: '3',
      name: 'New Student',
      branch: 'EXTC',
      class: 'TE',
      rollNo: 103,
      honoursDegree: 'Robotics',
      email: 'new.student@example.com',
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-03T00:00:00.000Z'
    };
    
    service.addStudent(newStudent);
    
    // Should get existing students first
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    
    // Should save the updated array back to localStorage
    const expectedStudents = [...mockStudents, newStudent];
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY, 
      JSON.stringify(expectedStudents)
    );
  });

  it('should check if roll number is unique', () => {
    // Should be unique for a new roll number
    expect(service.isRollNoUnique(103)).toBeTrue();
    
    // Should not be unique for an existing roll number
    expect(service.isRollNoUnique(101)).toBeFalse();
    
    // Should be unique for the same student (for updates)
    expect(service.isRollNoUnique(101, '1')).toBeTrue();
    
    // Should not be unique for a different student (for updates)
    expect(service.isRollNoUnique(101, '2')).toBeFalse();
  });

  it('should search students by various criteria', () => {
    // Search by name
    expect(service.searchStudents('John')).toEqual([mockStudents[0]]);
    
    // Search by email
    expect(service.searchStudents('jane.smith')).toEqual([mockStudents[1]]);
    
    // Search by roll number
    expect(service.searchStudents('101')).toEqual([mockStudents[0]]);
    
    // Search by branch
    expect(service.searchStudents('cs')).toEqual([mockStudents[0]]);
    
    // Search by class
    expect(service.searchStudents('se')).toEqual([mockStudents[1]]);
    
    // Search with empty query should return all
    expect(service.searchStudents('')).toEqual(mockStudents);
  });

  it('should clear all data', () => {
    service.clearAllData();
    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
