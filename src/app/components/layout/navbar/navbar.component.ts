import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, ButtonComponent],
  template: `
    <nav class="bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm sticky top-0 z-10 transition-all duration-300">
      <div class="container max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Student Management
              </a>
            </div>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <a routerLink="/" routerLinkActive="text-primary border-primary" [routerLinkActiveOptions]="{exact: true}" class="border-transparent text-foreground hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                Home
              </a>
              <a routerLink="/add" routerLinkActive="text-primary border-primary" class="border-transparent text-foreground hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                Add Student
              </a>
              <a routerLink="/view" routerLinkActive="text-primary border-primary" class="border-transparent text-foreground hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                View Records
              </a>
              <a routerLink="/settings" routerLinkActive="text-primary border-primary" class="border-transparent text-foreground hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200">
                Settings
              </a>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              class="p-2 rounded-full hover:bg-muted/80 transition-all duration-200 flex items-center justify-center"
              (click)="themeService.toggleTheme()"
              aria-label="Toggle theme"
            >
              <span *ngIf="themeService.currentTheme === 'dark'" class="text-lg">🌙</span>
              <span *ngIf="themeService.currentTheme === 'light'" class="text-lg">☀️</span>
            </button>
            
            <!-- Mobile menu button -->
            <button 
              class="sm:hidden p-2 rounded hover:bg-muted/80 transition-all duration-200"
              (click)="toggleMobileMenu()"
              aria-label="Toggle menu"
            >
              <span *ngIf="!mobileMenuOpen" class="text-xl">☰</span>
              <span *ngIf="mobileMenuOpen" class="text-xl">✕</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu, toggle classes based on menu state -->
      <div 
        [class.hidden]="!mobileMenuOpen"
        class="sm:hidden border-t border-border/40 animate-scale-in backdrop-blur-md bg-background/90"
      >
        <div class="pt-2 pb-3 space-y-1">
          <a 
            routerLink="/" 
            routerLinkActive="bg-primary/10 border-primary text-primary" 
            [routerLinkActiveOptions]="{exact: true}"
            (click)="closeMobileMenu()"
            class="border-l-4 border-transparent text-foreground hover:bg-muted/50 hover:border-primary/50 hover:text-primary block pl-3 pr-4 py-3 text-base font-medium transition-all duration-200"
          >
            Home
          </a>
          <a 
            routerLink="/add" 
            routerLinkActive="bg-primary/10 border-primary text-primary" 
            (click)="closeMobileMenu()"
            class="border-l-4 border-transparent text-foreground hover:bg-muted/50 hover:border-primary/50 hover:text-primary block pl-3 pr-4 py-3 text-base font-medium transition-all duration-200"
          >
            Add Student
          </a>
          <a 
            routerLink="/view" 
            routerLinkActive="bg-primary/10 border-primary text-primary" 
            (click)="closeMobileMenu()"
            class="border-l-4 border-transparent text-foreground hover:bg-muted/50 hover:border-primary/50 hover:text-primary block pl-3 pr-4 py-3 text-base font-medium transition-all duration-200"
          >
            View Records
          </a>
          <a 
            routerLink="/settings" 
            routerLinkActive="bg-primary/10 border-primary text-primary" 
            (click)="closeMobileMenu()"
            class="border-l-4 border-transparent text-foreground hover:bg-muted/50 hover:border-primary/50 hover:text-primary block pl-3 pr-4 py-3 text-base font-medium transition-all duration-200"
          >
            Settings
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    @media (max-width: 640px) {
      .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(4px);
        z-index: 40;
      }
    }
    
    nav {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .dark nav {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class NavbarComponent {
  mobileMenuOpen = false;
  
  constructor(public themeService: ThemeService) {}
  
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    // Prevent scrolling when mobile menu is open
    if (this.mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
  
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.classList.remove('overflow-hidden');
  }
  
  @HostListener('window:resize')
  onResize() {
    // Close mobile menu on window resize (particularly on desktop)
    if (window.innerWidth >= 640 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
