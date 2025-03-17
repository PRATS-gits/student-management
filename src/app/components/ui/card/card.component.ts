import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 ' + className">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    div.glass-card {
      background-color: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    :host-context(.dark) div.glass-card {
      background-color: rgba(30, 30, 30, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
    
    div:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
  `]
})
export class CardComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `
    <div [class]="'flex flex-col space-y-1.5 p-6 ' + className">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `
    <h3 [class]="'text-2xl font-semibold leading-none tracking-tight ' + className">
      <ng-content></ng-content>
    </h3>
  `
})
export class CardTitleComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  template: `
    <p [class]="'text-sm text-muted-foreground ' + className">
      <ng-content></ng-content>
    </p>
  `
})
export class CardDescriptionComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `
    <div [class]="'p-6 pt-0 ' + className">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  template: `
    <div [class]="'flex items-center p-6 pt-0 ' + className">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {
  @Input() className = '';
}
