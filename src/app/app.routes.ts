import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/index/index.component').then(c => c.IndexComponent),
    title: 'Home - Student Management System' 
  },
  { 
    path: 'add', 
    loadComponent: () => import('./pages/add-student/add-student.component').then(c => c.AddStudentComponent),
    title: 'Add Student - Student Management System'
  },
  { 
    path: 'view', 
    loadComponent: () => import('./pages/view-records/view-records.component').then(c => c.ViewRecordsComponent),
    title: 'View Records - Student Management System'
  },
  { 
    path: 'search', 
    loadComponent: () => import('./pages/search-student/search-student.component').then(c => c.SearchStudentComponent),
    title: 'Search Students - Student Management System'
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./pages/edit-student/edit-student.component').then(c => c.EditStudentComponent),
    title: 'Edit Student - Student Management System'
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./pages/settings/settings.component').then(c => c.SettingsComponent),
    title: 'Settings - Student Management System'
  },
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent),
    title: 'Page Not Found - Student Management System'
  }
];
