import { Component, OnInit } from '@angular/core';
import { AbbBug } from 'src/app/models/addBug.model';
import { FormsModule } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { CommonModule } from '@angular/common';
import { AddAtachment } from 'src/app/models/add-atachment.module';
import { StateService } from 'src/app/services/state.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AttachmentService } from 'src/app/services/Attachment.Service';
import { BugComparisonQuery } from 'src/app/web-api-client';
import { SearchSameBugsComponent } from '../Identifying-recurring-bugs/search-same-bugs/search-same-bugs.component';

@Component({
  selector: 'app-new-bug',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchSameBugsComponent],
  templateUrl: './new-bug.component.html',
  styleUrls: ['./new-bug.component.css']
})
export class NewBugComponent implements OnInit {
  createdDate: Date = new Date();
  formattedDate: string = this.createdDate.toLocaleDateString();
  formattedDateToSave: string = this.createdDate.toISOString();
  public newBug: AbbBug = new AbbBug();
  allCategory: any[] = [];
  allPriority: any[] = [];
  fileUrls: string[] = [];
  bugId: number = 0;
  numDocuments: number = 0;
  numFilm: number = 0;
  userName: string = "אסתר";
  showAttachments: boolean = false;
  allAttachment: Array<File> = [];
  mediaRecorder: MediaRecorder;
  public newDocument: AddAtachment = new AddAtachment();
  showDuplicateCheck = false;
  showSaveButton = true;

  constructor(private bugService: BugService, private stateService: StateService,
    private attachmentService: AttachmentService, private router: Router) { }
  ngOnInit(): void {
    this.loadAllCategory();
    this.loadAllPriority();
    this.newBug.statusId = 1;
    this.newBug.created = this.formattedDateToSave;
    this.newBug.createdByUserId = 1;
  }
  onCheckDuplicates() {
    this.showDuplicateCheck = true;
  }
  changeShowSaveButton() {
    this.showSaveButton = !this.showSaveButton;
  }
  onContinueAddBug() {
    this.showDuplicateCheck = false;
    if (!this.hasEnoughInfo()) {         
      return;
    }
    this.addBug();
  }
  getBugComparisonQuery(): BugComparisonQuery {
    return {
      title: this.newBug.title,
      description: this.newBug.description,
      categoryId: this.newBug.categoryId
    } as BugComparisonQuery;
  }
  async addBug() {
    try {
      const response = await this.bugService.createBug(this.newBug).toPromise();
      this.bugId = Number(response);
      console.log(this.allAttachment);
      await this.attachmentService.createAttachments(this.allAttachment, this.bugId);

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
  onCancel() {
    // this.showDuplicateCheck = false;
    Swal.fire({
      title: 'בטוח שברצונך לבטל?',
      text: 'כל השינויים לא יישמרו.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, בטל',
      cancelButtonText: 'לא, השאר'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/']);
      }
    });

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
    if (this.showAttachments === true) {
      this.allAttachments()
    }
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
        // if (blob) {
        //   const file = new File([blob], 'screenshot.png', { type: 'image/png' });
        //   this.allAttachment.push(file);
        // }
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          this.allAttachment.push(file);
          this.fileUrls.push(this.getFileUrl(file)); // שמירת ה-URL
        }
        track.stop();
      }, 'image/png');
    } catch (err) {
      console.error('שגיאה בצילום מסך', err);
    }
  }
  async onRecordVideo() {
    if (this.showAttachments === true) {
      this.allAttachments()
    }
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
        // const videoFile = new File([blob], 'recording.webm', { type: 'video/webm' });
        // this.allAttachment.push(videoFile);
        const videoFile = new File([blob], 'recording.webm', { type: 'video/webm' });
        this.allAttachment.push(videoFile);
        this.fileUrls.push(this.getFileUrl(videoFile)); // שמירת ה-URL
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
  allAttachments() {
    this.showAttachments = !this.showAttachments;
  }
  getFileUrl(file: File) {
    return URL.createObjectURL(file);
  }
  removeFileByIndex(index: number) {
    const file = this.allAttachment[index];
    this.allAttachment.splice(index, 1);

    // עדכון מספר הקבצים
    if (file.type.startsWith('video/')) {
      this.numFilm--; // אם הקובץ הוא וידאו
    } else {
      this.numDocuments--; // אם הקובץ הוא מסמך
    }
  }

  renameFile(index: number) {
    const newName = prompt("הכנס שם חדש לקובץ:", this.allAttachment[index].name);
    if (newName) {
      const file = this.allAttachment[index];
      // אי אפשר לשנות שם ישירות — צריך ליצור קובץ חדש
      const renamedFile = new File([file], newName, { type: file.type });
      this.allAttachment[index] = renamedFile;
    }
  }

  hasEnoughInfo(): boolean {
    // בודקים שדות חובה
    if (!this.newBug.title || this.newBug.title.trim().length < 5) {
      Swal.fire('חסר מידע', 'נא למלא כותרת של לפחות 5 תווים', 'warning');
      return false;
    }

    if (!this.newBug.description || this.newBug.description.trim().length < 10) {
      Swal.fire('חסר מידע', 'נא למלא תיאור של לפחות 10 תווים', 'warning');
      return false;
    }

    if (!this.newBug.categoryId) {
      Swal.fire('חסר מידע', 'נא לבחור קטגוריה', 'warning');
      return false;
    }

    if (this.allAttachment.length === 0) {
      Swal.fire('חסר מידע', 'נא לצרף לפחות קובץ אחד (צילום מסך או סרטון)', 'warning');
      return false;
    }

    // אם הכל תקין
    return true;
  }
}
