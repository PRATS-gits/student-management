import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="container max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[80vh] page-transition">
      <div class="mb-8 text-6xl">
        404
      </div>
      <h1 class="text-3xl font-bold mb-4">Page Not Found</h1>
      <p class="text-muted-foreground max-w-md mx-auto mb-8">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <div class="flex gap-4">
        <a routerLink="/">
          <app-button>
            Return Home
          </app-button>
        </a>
        <a routerLink="/view">
          <app-button variant="outline">
            View Records
          </app-button>
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
