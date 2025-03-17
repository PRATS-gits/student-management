import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label 
      [class]="'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ' + className" 
      [for]="htmlFor"
    >
      <ng-content></ng-content>
    </label>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 0.25rem;
    }
    
    label {
      transition: color 0.2s ease;
    }
    
    label:focus-within {
      color: var(--primary);
    }
  `]
})
export class LabelComponent {
  @Input() htmlFor = '';
  @Input() className = '';
}
