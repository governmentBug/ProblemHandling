import { Component, OnInit } from '@angular/core';
import { AbbBug } from 'src/app/models/addBug.model';
import { CategoryService } from 'src/app/services/category.service';
import { FormsModule } from '@angular/forms';
import { Category } from 'src/app/models/category.module';
import { BugService } from 'src/app/services/bug.service';
import { CommonModule } from '@angular/common';
import { PriorityService } from 'src/app/services/priority.service';
import { Priority } from 'src/app/models/priority.model';
import { AddAtachment } from 'src/app/models/add-atachment.module';
import { AddDocumentService } from 'src/app/services/add-atachment.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-new-bug',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-bug.component.html',
  styleUrl: './new-bug.component.css'
})

export class NewBugComponent implements OnInit {
  constructor(private bugService: BugService, private categoryService: CategoryService
    , private priorityService: PriorityService, private addDocumentService: AddDocumentService) { }

  // תאריך
  createdDate: Date = new Date();
  formattedDate: string = this.createdDate.toLocaleDateString();
  formattedDateToSave: string = this.createdDate.toISOString();
  // הבג להוספה
  public newBug: AbbBug = new AbbBug();
  // שמירת נתונים מהמסד
  allCategory: Category[] = [];
  allPriority: Priority[] = [];
  // שמירת נתונים משתנים
  bugId: number = 0;
  numDocuments: number = 0;
  numFilm: number = 0;
  userName: string = "אסתר";
  // שמירת הקבצים
  allFiles: Array<File> = new Array<File>;
  allFilms: Array<File> = new Array<File>;
  public newDocument: AddAtachment = new AddAtachment();

  ngOnInit(): void {
    this.loadAllCategory();
    this.loadAllPriority();
    this.newBug.statusId = 1;
    this.newBug.created = this.formattedDateToSave;
    this.newBug.createdByUserId = 1;
    this.newBug.priorityId = 1;
  }
  // הוספת הבג בפועל
  async addBug() {
    console.log(this.newBug);
    try {
      const response = await this.bugService.createBug(this.newBug).toPromise();
      console.log('Bug created:', response);
      this.bugId = Number(response);
      console.log(this.bugId);

      // הוספת קבצים
      await this.addAttachments(this.allFiles);

      // הוספת ההסרטות
      await this.addAttachments(this.allFilms, true);

    } catch (error) {
      console.error('Error creating bug:', error);
      if (error.error) {
        console.error('Error details:', error.error);
      }
    }
  }
  // הוספת קובץ בפועל
  private async addAttachments(files: File[], isFilm: boolean = false) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      const promise = new Promise<void>((resolve, reject) => {
        reader.onload = (e: any) => {
          const base64String = isFilm ? this.arrayBufferToBase64(e.target.result) : e.target.result.split(',')[1];
          this.newDocument = new AddAtachment(this.bugId, files[i].name, files[i].type, base64String);

          this.addDocumentService.AddAtachment(this.newDocument).subscribe(response => {
            console.log('Attachment created:', response);
            resolve();
          }, error => {
            console.error('Error creating attachment:', error);
            if (error.error) {
              console.error('Error details:', error.error);
            }
            reject(error);
          });
        };

        if (isFilm) {
          reader.readAsArrayBuffer(files[i]);
        } else {
          reader.readAsDataURL(files[i]);
        }
      });

      await promise;
    }
  }
  // // המרת הסרטה לבינארי
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  // הבאת נתונים מהמסד
  loadAllCategory() {
    this.categoryService.getAllCategory().subscribe({
      next: Category => {
        this.allCategory = Category;
      },
      error: err => console.error('שגיאה בקבלת הCategory:', err)
    });
  }
  // הבאת נתונים מהמסד
  loadAllPriority() {
    this.priorityService.getAllPriority().subscribe({
      next: Priority => {
        this.allPriority = Priority;
      },
      error: err => console.error('שגיאה בקבלת Priority:', err)
    });
  }
  // הוספת קובץ
  onFileSelected(event: any) {
    this.allFiles.push(event.target.files[0]);
    this.numDocuments++;
  }
  // הוספת הסטרה
  onFilmSelected(event: any) {
    this.allFilms.push(event.target.files[0]);
    this.numFilm++;
    console.log(this.allFilms);
  }
  // לחיצה על הוספת קובץ
  onButtonClickFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  // לחיצה על הוספת הסרטה
  onButtonClickFilm() {
    const filmInput = document.getElementById('filmInput') as HTMLInputElement;
    filmInput.click();
  }

}