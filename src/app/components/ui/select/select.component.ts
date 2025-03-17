import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <select
        [value]="value"
        [disabled]="disabled"
        [class]="getSelectClasses()"
        (change)="onValueChange($event)"
        (blur)="onTouched()"
      >
        <ng-content></ng-content>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="text-muted-foreground"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    select {
      appearance: none;
      background-image: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    select:focus {
      outline: none;
      border-color: hsl(var(--ring));
      box-shadow: 0 0 0 2px rgba(var(--ring), 0.3);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() disabled: boolean = false;
  @Input() className: string = '';
  @Input() value: string = '';

  @Output() valueChange = new EventEmitter<string>();
  
  onChange: any = () => {};
  onTouched: any = () => {};

  getSelectClasses(): string {
    return `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8 ${this.className}`;
  }

  onValueChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [CommonModule],
  template: `
    <option [value]="value" [disabled]="disabled">
      <ng-content></ng-content>
    </option>
  `
})
export class OptionComponent {
  @Input() value = '';
  @Input() disabled = false;
}
