import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div *ngIf="open" @fadeAnimation class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div @scaleAnimation class="fixed z-50 flex items-center justify-center">
        <div 
          class="bg-background rounded-lg border shadow-lg w-full max-w-md p-6"
          [class.glass-card]="glassEffect"
        >
          <div class="mb-5">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
            <p class="text-sm text-muted-foreground mt-1">{{ description }}</p>
          </div>
          
          <div class="flex justify-end gap-2">
            <app-button 
              variant="outline" 
              (click)="onCancel.emit(); openChange.emit(false)"
            >
              {{ cancelText }}
            </app-button>
            <app-button 
              [variant]="confirmVariant"
              (click)="onConfirm.emit(); openChange.emit(false)"
            >
              {{ confirmText }}
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class AlertDialogComponent {
  @Input() open: boolean = false;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() glassEffect: boolean = false;
  @Input() confirmVariant: 'default' | 'destructive' = 'default';
  
  @Output() openChange = new EventEmitter<boolean>();
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
