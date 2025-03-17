import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../../services/toast.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-0 right-0 z-50 p-4 flex flex-col items-end gap-3 pointer-events-none max-w-[420px]">
      <ng-container *ngFor="let toast of toasts; trackBy: trackById">
        <div 
          @toastAnimation
          class="bg-background/95 backdrop-blur-md border rounded-lg shadow-lg p-4 flex items-start gap-3 w-full pointer-events-auto transition-all duration-200"
          [ngClass]="{'border-destructive': toast.variant === 'destructive'}"
        >
          <div 
            class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full"
            [ngClass]="{
              'bg-primary/20': toast.variant !== 'destructive',
              'bg-destructive/20': toast.variant === 'destructive'
            }"
          >
            <span
              [ngClass]="{
                'text-primary': toast.variant !== 'destructive',
                'text-destructive': toast.variant === 'destructive'
              }"
            >
              {{ toast.variant === 'destructive' ? '⚠️' : '✓' }}
            </span>
          </div>
          <div class="flex-1">
            <h3 class="font-medium mb-1">{{toast.title}}</h3>
            <p *ngIf="toast.description" class="text-sm text-muted-foreground">{{toast.description}}</p>
          </div>
          <button 
            class="text-muted-foreground hover:text-foreground rounded-md p-1 hover:bg-muted transition-colors flex-shrink-0"
            (click)="dismiss(toast.id)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </ng-container>
    </div>
  `,
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%) translateY(0)'
      })),
      transition(':enter', [
        animate('250ms ease-out', style({
          opacity: 1,
          transform: 'translateX(0) translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({
          opacity: 0,
          transform: 'translateX(100%) translateY(0)'
        }))
      ])
    ])
  ],
  styles: [`
    :host {
      display: block;
    }
    
    .border-destructive {
      border-color: hsl(var(--destructive)) !important;
      box-shadow: 0 4px 12px rgba(var(--destructive), 0.1);
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(private toastService: ToastService) {}
  
  ngOnInit(): void {
    this.toastService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toasts => {
        this.toasts = toasts;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
  
  trackById(index: number, toast: Toast): string {
    return toast.id;
  }
}
