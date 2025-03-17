export type Branch = 'CS' | 'IT' | 'EXTC' | 'ECS' | 'ELEC' | 'Mech';

export type Class = 'FE' | 'SE' | 'TE' | 'BE';

export type HonoursDegree = 'None' | 'Data Science' | 'AI&ML' | 'Robotics' | 'IoT';

export interface StudentFormData {
  name: string;
  branch: Branch;
  class: Class;
  rollNo: number;
  honoursDegree: HonoursDegree;
  email: string;
}

export interface Student extends StudentFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentState {
  students: Student[];
  filteredStudents: Student[];
  loading: boolean;
  searchQuery: string;
}
