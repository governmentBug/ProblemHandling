// file-uploader.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { FileUpload } from 'src/app/models/FileUpload';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.css'
})
export class FileUploaderComponent {

  /** מצבור הקבצים שנשלח למעלה */
  attachments: FileUpload[] = [];

  @Output() filesChanged = new EventEmitter<FileUpload[]>();

  /* --- בוחרים קובץ --- */
  onFilesSelected(event: Event, isFilm: boolean) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) { return; }

    const file = input.files[0];

 
    const dto: FileUpload = {
      file,              // קובץ ה‑Blob עצמו
      isFilm,            // true  = וידאו, false = תמונה
      /* attachmentId נשאר לא מוגדר (קובץ חדש) */
    };

    this.attachments.push(dto);
    this.filesChanged.emit(this.attachments);
    input.value = '';             // מאפשר בחירה חוזרת של אותו קובץ
  }

  /* --- פותח את הדיאלוג --- */
  triggerFileInput(isFilm: boolean) {
    const id = isFilm ? 'filmInput' : 'fileInput';
    (document.getElementById(id) as HTMLInputElement).click();
  }

  /* --- מאפשר להסיר קובץ לפני שליחה (לא חובה) --- */
  remove(index: number) {
    this.attachments.splice(index, 1);
    this.filesChanged.emit(this.attachments);
  }
}
