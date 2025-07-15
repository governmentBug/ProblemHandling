import { Component, OnInit } from '@angular/core';
import { AbbBug } from 'src/app/models/addBug.model';
import { FormsModule } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { CommonModule } from '@angular/common';
import { AddAtachment } from 'src/app/models/add-atachment.module';
import { AddDocumentService } from 'src/app/services/add-atachment.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-new-bug',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-bug.component.html',
  styleUrl: './new-bug.component.css'
})

export class NewBugComponent implements OnInit {
  constructor(private bugService: BugService, private stateService: StateService
    , private addDocumentService: AddDocumentService) { }

  // תאריך
  createdDate: Date = new Date();
  formattedDate: string = this.createdDate.toLocaleDateString();
  formattedDateToSave: string = this.createdDate.toISOString();
  // הבג להוספה
  public newBug: AbbBug = new AbbBug();
  // שמירת נתונים מהמסד
  allCategory: any[] = [];
  allPriority: any[] = [];
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
    // מי שמשתמש עכשיו
    this.newBug.createdByUserId = 1;
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
    this.stateService.getAllCategories().subscribe({
      next: Category => {
        this.allCategory = Category;
      },
      error: err => console.error('שגיאה בקבלת הCategory:', err)
    });
  }
  // הבאת נתונים מהמסד
  loadAllPriority() {
    this.stateService.getAllPriority().subscribe({
      next: Priority => {
        this.allPriority = Priority;
      },
      error: err => console.error('שגיאה בקבלת Priority:', err)
    });
  }
// צילום מסך
  async onScreenshot() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];

      const video = document.createElement('video');
      video.style.display = 'none'; // לא מציג אותו
      video.srcObject = stream;
      video.play();

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      this.numDocuments++;

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          this.allFiles.push(file);
        }
        track.stop(); // לסגור את הזרם מיד
      }, 'image/png');
    } catch (err) {
      console.error('שגיאה בצילום מסך', err);
    }
  }
// הסרטת מסך
  async onRecordVideo() {
    try {
      // מבקש מהמשתמש הרשאות להקליט וידאו ואודיו מהמסך
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // יוצר אלמנט אודיו ומנגן את הזרם
      const audioElement = document.createElement('audio');
      audioElement.srcObject = stream;
      audioElement.play();

      // יוצר MediaRecorder כדי להקליט את הזרם
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = []; // מערך לאחסון הנתונים המוקלטים

      // כאשר יש נתונים זמינים, מוסיף אותם למערך
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      this.numFilm++; // מעדכן את מספר המסמכים

      // כאשר ההקלטה נעצרת
      mediaRecorder.onstop = () => {
        // יוצר Blob מהנתונים המוקלטים
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob); // יוצר URL לוידאו

        // יוצר אלמנט וידאו ומגדיר את ה-src לוידאו המוקלט
        const videoElement = document.createElement('video');
        videoElement.src = videoURL;
        videoElement.controls = true; // מוסיף כפתורי שליטה

        console.log(this.allFiles);
        
        // מוסיף את הוידאו המוקלט לרשימת הקבצים
        this.allFiles.push(new File([blob], 'recording.webm', { type: 'video/webm' }));
      };

      mediaRecorder.start(); // מתחיל את ההקלטה
    } catch (err) {
      console.error('שגיאה בהקלטת וידאו', err); // מדפיס שגיאה אם משהו משתבש
    }
  }
}