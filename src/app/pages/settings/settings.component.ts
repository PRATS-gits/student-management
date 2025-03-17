import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { CardComponent, CardContentComponent, CardDescriptionComponent, CardHeaderComponent, CardTitleComponent } from '../../components/ui/card/card.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { LabelComponent } from '../../components/ui/label/label.component';
import { AlertDialogComponent } from '../../components/ui/alert-dialog/alert-dialog.component';
import { ThemeService } from '../../services/theme.service';
import { StudentService } from '../../services/student.service';
import { ToastService } from '../../services/toast.service';
import { StorageManagerService } from '../../services/storage-manager.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    ButtonComponent,
    LabelComponent,
    AlertDialogComponent
  ],
  template: `
    <div class="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Settings</h1>
        <p class="text-muted-foreground">
          Configure application preferences
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card className="glass-card">
          <app-card-header>
            <app-card-title>Appearance</app-card-title>
            <app-card-description>
              Customize how the application looks
            </app-card-description>
          </app-card-header>
          <app-card-content class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <app-label htmlFor="dark-mode">Dark Mode</app-label>
                <p class="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <div class="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                <input
                  type="checkbox"
                  id="dark-mode"
                  class="peer sr-only"
                  [checked]="themeService.currentTheme === 'dark'"
                  (change)="handleThemeChange($event)"
                />
                <span
                  class="absolute inset-y-0 start-0 flex h-6 w-6 items-center justify-center rounded-full bg-background transition-all peer-checked:start-5"
                ></span>
              </div>
            </div>
          </app-card-content>
        </app-card>
        
        <app-card className="glass-card">
          <app-card-header>
            <app-card-title>Data Management</app-card-title>
            <app-card-description>
              Export or import your data
            </app-card-description>
          </app-card-header>
          <app-card-content class="space-y-6">
            <div class="space-y-2">
              <app-label>Export Data</app-label>
              <p class="text-sm text-muted-foreground">
                Download student records as a file
              </p>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <app-button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  (onClick)="exportAllDataJson()"
                  [disabled]="students.length === 0"
                >
                  <span>📥</span>
                  Export as JSON
                </app-button>
                <app-button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  (onClick)="exportAllDataCsv()"
                  [disabled]="students.length === 0"
                >
                  <span>📊</span>
                  Export as CSV
                </app-button>
              </div>
            </div>
            
            <hr class="border-border my-4" />
            
            <div class="space-y-2">
              <app-label>Import Data</app-label>
              <p class="text-sm text-muted-foreground">
                Import student records from a JSON file
              </p>
              <input
                type="file"
                accept=".json"
                class="hidden"
                #fileInput
                (change)="handleFileSelect($event)"
              />
              <app-button 
                variant="outline" 
                className="w-full mt-2 flex items-center gap-2"
                (onClick)="fileInput.click()"
              >
                <span>📤</span>
                Import from JSON
              </app-button>
            </div>
            
            <hr class="border-border my-4" />
            
            <div class="space-y-2">
              <app-label className="text-destructive">Danger Zone</app-label>
              <p class="text-sm text-muted-foreground">
                Clear all student records from the application
              </p>
              <app-button 
                variant="destructive" 
                className="w-full mt-2 flex items-center gap-2"
                (onClick)="openClearDialog()"
              >
                <span>🗑️</span>
                Clear All Data
              </app-button>
            </div>
          </app-card-content>
        </app-card>
        
        <app-card className="glass-card md:col-span-2">
          <app-card-header>
            <app-card-title>About</app-card-title>
            <app-card-description>
              Information about this application
            </app-card-description>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="text-primary flex-shrink-0 mt-1 text-2xl">ℹ️</div>
              <div>
                <h3 class="text-lg font-semibold">Student Records Management</h3>
                <p class="text-sm text-muted-foreground mb-2">
                  A simple, elegant application for managing engineering student records
                </p>
                <p class="text-sm text-muted-foreground">
                  This application allows faculty to efficiently manage student data,
                  including adding new students, editing existing records, and searching
                  through the database. All data is stored locally in your browser.
                </p>
              </div>
            </div>
          </app-card-content>
        </app-card>
      </div>

      <app-alert-dialog
        [open]="showClearDialog"
        title="Are you absolutely sure?"
        description="This will permanently delete all student records from your browser storage. This action cannot be undone and your data will be lost."
        confirmText="Yes, clear all data"
        cancelText="Cancel"
        confirmVariant="destructive"
        [glassEffect]="true"
        (onConfirm)="clearAllData()"
        (onCancel)="cancelClearDialog()"
        (openChange)="onAlertDialogOpenChange($event)"
      ></app-alert-dialog>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  students: Student[] = [];
  showClearDialog: boolean = false;
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  constructor(
    public themeService: ThemeService,
    private studentService: StudentService,
    private toastService: ToastService,
    private storageManager: StorageManagerService
  ) {}
  
  ngOnInit(): void {
    // Subscribe to students changes
    this.studentService.students$.subscribe(students => {
      this.students = students;
    });
  }
  
  handleThemeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.themeService.setTheme(target.checked ? 'dark' : 'light');
  }
  
  exportAllDataJson(): void {
    this.storageManager.exportDataToJson();
  }
  
  exportAllDataCsv(): void {
    this.storageManager.exportDataToCsv();
  }
  
  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.toastService.show({
          title: 'Error',
          description: 'File size exceeds the limit (5MB)',
          variant: 'destructive'
        });
        this.resetFileInput();
        return;
      }
      
      // Check file extension
      if (!file.name.toLowerCase().endsWith('.json')) {
        this.toastService.show({
          title: 'Error',
          description: 'Only JSON files are supported',
          variant: 'destructive'
        });
        this.resetFileInput();
        return;
      }
      
      // Import the file
      this.storageManager.importDataFromJson(file)
        .then(() => {
          this.resetFileInput();
        })
        .catch(error => {
          console.error('Import error:', error);
          this.resetFileInput();
        });
    }
  }
  
  resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  
  openClearDialog(): void {
    this.showClearDialog = true;
  }
  
  cancelClearDialog(): void {
    this.showClearDialog = false;
  }
  
  clearAllData(): void {
    this.studentService.clearAllData();
    this.showClearDialog = false;
  }
  
  onAlertDialogOpenChange(isOpen: boolean): void {
    this.showClearDialog = isOpen;
  }
}
