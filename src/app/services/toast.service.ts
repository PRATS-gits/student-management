import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private addToastSubject = new Subject<Toast>();
  private removeToastSubject = new Subject<string>();
  
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();
  addToast$: Observable<Toast> = this.addToastSubject.asObservable();
  removeToast$: Observable<string> = this.removeToastSubject.asObservable();
  
  constructor() {
    // Subscribe to add and remove events to update the toasts array
    this.addToast$.subscribe(toast => {
      this.toastsSubject.next([...this.toastsSubject.value, toast]);
      
      // Auto-dismiss toast after duration
      if (toast.duration !== undefined && toast.duration > 0) {
        setTimeout(() => {
          this.dismiss(toast.id);
        }, toast.duration);
      }
    });
    
    this.removeToast$.subscribe(id => {
      this.toastsSubject.next(
        this.toastsSubject.value.filter(t => t.id !== id)
      );
    });
  }
  
  show(toast: Omit<Toast, 'id'>): string {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 3000, // Default 3 seconds
    };
    
    this.addToastSubject.next(newToast);
    return id;
  }
  
  dismiss(id: string): void {
    this.removeToastSubject.next(id);
  }
  
  clear(): void {
    this.toastsSubject.next([]);
  }
}
