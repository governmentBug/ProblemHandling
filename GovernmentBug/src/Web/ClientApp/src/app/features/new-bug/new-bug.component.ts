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

@Component({
  selector: 'app-new-bug',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  bugId: number = 0;
  numDocuments: number = 0;
  numFilm: number = 0;
  userName: string = "אסתר";
  showAttachments: boolean = false;
  allAttachment: Array<File> = [];
  mediaRecorder: MediaRecorder;
  public newDocument: AddAtachment = new AddAtachment();

  constructor(private bugService: BugService, private stateService: StateService,
    private attachmentService: AttachmentService, private router: Router) { }
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
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          this.allAttachment.push(file);
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
        const videoFile = new File([blob], 'recording.webm', { type: 'video/webm' });
        this.allAttachment.push(videoFile);
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
}
