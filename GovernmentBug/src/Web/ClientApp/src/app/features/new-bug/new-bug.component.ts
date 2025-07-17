// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { AbbBug } from 'src/app/models/addBug.model';
// import { FormsModule } from '@angular/forms';
// import { BugService } from 'src/app/services/bug.service';
// import { CommonModule } from '@angular/common';
// import { AddAtachment } from 'src/app/models/add-atachment.module';
// import { AddDocumentService } from 'src/app/services/add-atachment.service';
// import { StateService } from 'src/app/services/state.service';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-new-bug',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './new-bug.component.html',
//   styleUrl: './new-bug.component.css'
// })

// export class NewBugComponent implements OnInit {
//   constructor(private bugService: BugService, private stateService: StateService
//     , private addDocumentService: AddDocumentService, private router: Router,
//     private cdr: ChangeDetectorRef) { }

//   // תאריך
//   createdDate: Date = new Date();
//   formattedDate: string = this.createdDate.toLocaleDateString();
//   formattedDateToSave: string = this.createdDate.toISOString();
//   // הבג להוספה
//   public newBug: AbbBug = new AbbBug();
//   // שמירת נתונים מהמסד
//   allCategory: any[] = [];
//   allPriority: any[] = [];
//   // שמירת נתונים משתנים
//   bugId: number = 0;
//   numDocuments: number = 0;
//   numFilm: number = 0;
//   userName: string = "אסתר";
//   // שמירת הקבצים
//   allFiles: Array<File> = new Array<File>;
//   allFilms: Array<File> = new Array<File>;
//   attachedFiles: { name: string, file: File }[] = [];
//   mediaRecorder: MediaRecorder;
//   public newDocument: AddAtachment = new AddAtachment();

//   ngOnInit(): void {
//     this.loadAllCategory();
//     this.loadAllPriority();
//     this.newBug.statusId = 1;
//     this.newBug.created = this.formattedDateToSave;
//     this.newBug.categoryId = 0
//     this.newBug.priorityId = 0
//     // מי שמשתמש עכשיו
//     this.newBug.createdByUserId = 1;
//   }
//   // הוספת הבג בפועל
//   async addBug() {
//     console.log(this.newBug);
//     try {
//       const response = await this.bugService.createBug(this.newBug).toPromise();
//       console.log('Bug created:', response);
//       this.bugId = Number(response);
//       console.log(this.bugId);

//       // הוספת קבצים
//       await this.addAttachments(this.allFiles);

//       // הוספת ההסרטות
//       await this.addAttachments(this.allFilms, true);

//       Swal.fire({
//         title: 'הבאג נשמר!',
//         text: 'הבאג נוסף בהצלחה.',
//         icon: 'success',
//         confirmButtonText: 'אוקי'
//       });

//       this.router.navigate(['/']);

//     } catch (error) {
//       console.error('Error creating bug:', error);
//       if (error.error) {
//         console.error('Error details:', error.error);
//       }
//     }
//   }
//   // הוספת קובץ בפועל
//   private async addAttachments(files: File[], isFilm: boolean = false) {
//     for (let i = 0; i < files.length; i++) {
//       const reader = new FileReader();

//       const promise = new Promise<void>((resolve, reject) => {
//         reader.onload = (e: any) => {
//           const base64String = isFilm ? this.arrayBufferToBase64(e.target.result) : e.target.result.split(',')[1];
//           this.newDocument = new AddAtachment(this.bugId, files[i].name, files[i].type, base64String);

//           this.addDocumentService.AddAtachment(this.newDocument).subscribe(response => {
//             console.log('Attachment created:', response);
//             resolve();
//           }, error => {
//             console.error('Error creating attachment:', error);
//             if (error.error) {
//               console.error('Error details:', error.error);
//             }
//             reject(error);
//           });
//         };

//         if (isFilm) {
//           reader.readAsArrayBuffer(files[i]);
//         } else {
//           reader.readAsDataURL(files[i]);
//         }
//       });

//       await promise;
//     }
//   }
//   // // המרת הסרטה לבינארי
//   private arrayBufferToBase64(buffer: ArrayBuffer): string {
//     let binary = '';
//     const bytes = new Uint8Array(buffer);
//     const len = bytes.byteLength;
//     for (let i = 0; i < len; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
//   }
//   // הבאת נתונים מהמסד
//   loadAllCategory() {
//     this.stateService.getAllCategories().subscribe({
//       next: Category => {
//         this.allCategory = Category;
//       },
//       error: err => console.error('שגיאה בקבלת הCategory:', err)
//     });
//   }
//   // הבאת נתונים מהמסד
//   loadAllPriority() {
//     this.stateService.getAllPriority().subscribe({
//       next: Priority => {
//         this.allPriority = Priority;
//       },
//       error: err => console.error('שגיאה בקבלת Priority:', err)
//     });
//   }
//   // צילום מסך
//   async onScreenshot() {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       const track = stream.getVideoTracks()[0];

//       const video = document.createElement('video');
//       video.style.display = 'none'; // לא מציג אותו
//       video.srcObject = stream;
//       video.play();

//       await new Promise<void>((resolve) => {
//         video.onloadedmetadata = () => resolve();
//       });

//       const canvas = document.createElement('canvas');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       this.numDocuments++;

//       canvas.toBlob((blob) => { // כאן blob מוגדר
//         if (blob) {
//           const file = new File([blob], 'screenshot.png', { type: 'image/png' });
//           this.allFiles.push(file);
//           this.attachedFiles.push({ name: 'screenshot.png', file }); // הוסף את הקובץ לרשימה
//         }
//         track.stop(); // לסגור את הזרם מיד
//       }, 'image/png');
//     } catch (err) {
//       console.error('שגיאה בצילום מסך', err);
//     }
//   }
//   // // הסרטת מסך
//   async onRecordVideo() {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: true
//       });

//       this.mediaRecorder = new MediaRecorder(stream);
//       const chunks: Blob[] = []; // מערך לאחסון הנתונים המוקלטים

//       this.mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);
//         }
//       };

//       this.numFilm++; // מעדכן את מספר המסמכים

//       this.mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: 'video/webm' });
//         const videoFile = new File([blob], 'recording.webm', { type: 'video/webm' });
//         this.allFiles.push(videoFile);
//         this.attachedFiles.push({ name: 'recording.webm', file: videoFile }); // הוסף את הקובץ לרשימה

//         // דחה את השינוי עד לסוף מחזור הבדיקה
//         setTimeout(() => {
//           this.cdr.detectChanges(); // אם אתה משתמש ב-ChangeDetectorRef
//         });
//       };

//       // this.mediaRecorder.onstop = () => {
//       //   const blob = new Blob(chunks, { type: 'video/webm' });
//       //   const videoFile = new File([blob], 'recording.webm', { type: 'video/webm' });
//       //   this.allFiles.push(videoFile);
//       //   this.attachedFiles.push({ name: 'recording.webm', file: videoFile }); // הוסף את הקובץ לרשימה
//       // };

//       this.mediaRecorder.start(); // מתחיל את ההקלטה

//       setTimeout(() => {
//         this.stopRecording();
//       }, 90000);

//     } catch (err) {
//       console.error('שגיאה בהקלטת וידאו', err);
//     }
//   }
//   // פונקציה חדשה להפסיק את ההקלטה
//   stopRecording() {
//     if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
//       this.mediaRecorder.stop();
//       this.mediaRecorder.stream.getTracks().forEach(track => track.stop()); // סגירת הזרם
//     }
//   }
//   // הוספת שדה לאחסון הקבצים המוספים  
//   removeFile(attachedFile: { name: string, file: File }) {
//     this.attachedFiles = this.attachedFiles.filter(file => file !== attachedFile);
//     this.allFiles = this.allFiles.filter(file => file !== attachedFile.file);
//   }
//   getVideoUrl(file: File): string {
//     return URL.createObjectURL(file);
//   }

// }


import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbbBug } from 'src/app/models/addBug.model';
import { FormsModule } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { CommonModule } from '@angular/common';
import { AddAtachment } from 'src/app/models/add-atachment.module';
import { AddDocumentService } from 'src/app/services/add-atachment.service';
import { StateService } from 'src/app/services/state.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-bug',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-bug.component.html',
  styleUrls: ['./new-bug.component.css'] // יש לתקן ל-styleUrls
})
export class NewBugComponent implements OnInit {
  createdDate: Date = new Date();
  formattedDate: string = this.createdDate.toLocaleDateString();
  formattedDateToSave: string = this.createdDate.toISOString();
  public newBug: AbbBug = new AbbBug();
  allCategory: any[] = [];
  allPriority: any[] = [];
  bugId: number = 0;
  numDocuments: number = 0;
  numFilm: number = 0;
  userName: string = "אסתר";
  allFiles: Array<File> = [];
  allFilms: Array<File> = [];
  attachedFiles: { name: string, file: File }[] = [];
  mediaRecorder: MediaRecorder;
  public newDocument: AddAtachment = new AddAtachment();

  constructor(private bugService: BugService, private stateService: StateService,
    private addDocumentService: AddDocumentService, private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadAllCategory();
    this.loadAllPriority();
    this.newBug.statusId = 1;
    this.newBug.created = this.formattedDateToSave;
    this.newBug.createdByUserId = 1;
  }

  async addBug() {
    try {
      const response = await this.bugService.createBug(this.newBug).toPromise();
      this.bugId = Number(response);
      await this.addAttachments(this.allFiles);
      await this.addAttachments(this.allFilms, true);

      Swal.fire({
        title: 'הבאג נשמר!',
        text: 'הבאג נוסף בהצלחה.',
        icon: 'success',
        confirmButtonText: 'אוקי'
      });

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error creating bug:', error);
      if (error.error) {
        console.error('Error details:', error.error);
      }
    }
  }

  private async addAttachments(files: File[], isFilm: boolean = false) {
    for (const file of files) {
      const reader = new FileReader();
      const promise = new Promise<void>((resolve, reject) => {
        reader.onload = (e: any) => {
          const base64String = isFilm ? this.arrayBufferToBase64(e.target.result) : e.target.result.split(',')[1];
          this.newDocument = new AddAtachment(this.bugId, file.name, file.type, base64String);

          this.addDocumentService.AddAtachment(this.newDocument).subscribe(response => {
            resolve();
          }, error => {
            console.error('Error creating attachment:', error);
            reject(error);
          });
        };

        isFilm ? reader.readAsArrayBuffer(file) : reader.readAsDataURL(file);
      });

      await promise;
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  loadAllCategory() {
    this.stateService.getAllCategories().subscribe({
      next: categories => this.allCategory = categories,
      error: err => console.error('שגיאה בקבלת הCategory:', err)
    });
  }

  loadAllPriority() {
    this.stateService.getAllPriority().subscribe({
      next: priorities => this.allPriority = priorities,
      error: err => console.error('שגיאה בקבלת Priority:', err)
    });
  }

  async onScreenshot() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      this.numDocuments++;
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          this.allFiles.push(file);
          this.attachedFiles.push({ name: 'screenshot.png', file });
        }
        track.stop();
      }, 'image/png');
    } catch (err) {
      console.error('שגיאה בצילום מסך', err);
    }
  }
  async onRecordVideo() {
  console.log(this.allFiles);

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    const audioTracks = stream.getAudioTracks();

    // בדוק אם יש מסלול שמע
    if (audioTracks.length === 0) {
      const userConfirmed = confirm("השמע לא דלוק. האם אתה רוצה להמשיך בהקלטה בלי שמע?");
      if (!userConfirmed) {
        // עצור את ההקלטה אם המשתמש לא מאשר
        stream.getTracks().forEach(track => track.stop()); // עצור את כל ה-tracks
        return; // אם המשתמש לא מאשר, יוצאים מהפונקציה
      }
    }

    this.mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    this.numFilm++;
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoFile = new File([blob], 'recording.webm', { type: 'video/webm' });
      this.allFiles.push(videoFile);
      this.attachedFiles.push({ name: 'recording.webm', file: videoFile });
    };

    this.mediaRecorder.start();
    setTimeout(() => this.stopRecording(), 90000);
  } catch (err) {
    console.error('שגיאה בהקלטת וידאו', err);
  }
}
  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  removeFile(attachedFile: { name: string, file: File }) {
    this.attachedFiles = this.attachedFiles.filter(file => file !== attachedFile);
    this.allFiles = this.allFiles.filter(file => file !== attachedFile.file);
  }
  allAttachments(){
    console.log("in");
    
  }
}
