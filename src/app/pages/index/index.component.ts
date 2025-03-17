import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardComponent, CardContentComponent, CardDescriptionComponent, CardFooterComponent, CardHeaderComponent, CardTitleComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, CommonModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent, ButtonComponent],
  template: `
    <div class="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Student Records Management
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto font-normal">
          An elegant, user-friendly application for managing Engineering Student Records
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <app-card *ngFor="let feature of features; let i = index" 
          className="glass-card hover:shadow-md transition-all duration-300"
          [style.animation-delay.ms]="i * 100">
          <app-card-header className="pb-2">
            <div class="mb-2 text-primary text-3xl">
              <span [innerHTML]="feature.icon"></span>
            </div>
            <app-card-title>{{ feature.title }}</app-card-title>
            <app-card-description>{{ feature.description }}</app-card-description>
          </app-card-header>
          <app-card-footer>
            <app-button 
              variant="outline" 
              (onClick)="navigate(feature.route)"
              className="w-full">
              Go to {{ feature.title }}
            </app-button>
          </app-card-footer>
        </app-card>
      </div>

      <app-card className="glass-card">
        <app-card-header>
          <app-card-title>About This Application</app-card-title>
          <app-card-description>
            Designed with simplicity and elegance at its core
          </app-card-description>
        </app-card-header>
        <app-card-content>
          <p class="text-muted-foreground mb-4">
            This student records management system was built with a focus on clean, intuitive design
            and efficient functionality. It allows faculty to manage engineering student data with ease.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div class="p-4 rounded-md bg-secondary">
              <h3 class="font-medium mb-1">Intuitive Design</h3>
              <p class="text-sm text-muted-foreground">Clean, user-friendly interface that's easy to navigate</p>
            </div>
            <div class="p-4 rounded-md bg-secondary">
              <h3 class="font-medium mb-1">Responsive</h3>
              <p class="text-sm text-muted-foreground">Works perfectly on desktops, tablets, and mobile devices</p>
            </div>
            <div class="p-4 rounded-md bg-secondary">
              <h3 class="font-medium mb-1">Data Management</h3>
              <p class="text-sm text-muted-foreground">Efficient tools for adding, editing and organizing records</p>
            </div>
          </div>
        </app-card-content>
        <app-card-footer>
          <app-button (onClick)="navigate('/view')" className="w-full">
            Get Started
          </app-button>
        </app-card-footer>
      </app-card>
    </div>
  `
})
export class IndexComponent {
  features = [
    {
      title: 'Add Student',
      description: 'Add a new student to the system with complete details',
      icon: '👨‍🎓',
      route: '/add'
    },
    {
      title: 'View Records',
      description: 'View and manage all student records',
      icon: '📋',
      route: '/view'
    },
    {
      title: 'Search Students', 
      description: 'Find students by name, roll number, or email',
      icon: '🔍',
      route: '/search'
    },
    {
      title: 'Settings',
      description: 'Configure application settings',
      icon: '⚙️',
      route: '/settings'
    }
  ];

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigateByUrl(route);
  }
}
