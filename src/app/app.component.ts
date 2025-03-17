import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, ToastComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground flex flex-col">
      <app-navbar></app-navbar>
      <main class="flex-grow flex-1 container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      width: 100%;
    }
  `]
})
export class AppComponent {
  title = 'Student Management System';
}
