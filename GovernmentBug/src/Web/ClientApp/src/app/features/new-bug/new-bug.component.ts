import { Component, OnInit } from '@angular/core';
import { AbbBug } from 'src/app/models/addBug.model';
import { FormsModule } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { CommonModule } from '@angular/common';
import { StateService } from 'src/app/services/state.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AttachmentService } from 'src/app/services/Attachment.Service';
import { BugComparisonQuery } from 'src/app/web-api-client';
import { SearchSameBugsComponent } from '../Identifying-recurring-bugs/search-same-bugs/search-same-bugs.component';
import { AllBugsComponent } from '../all-bugs/all-bugs.component';

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
  showDuplicateCheck = false;
  showSaveButton = true;
  qualityScore: number = 0;
  qualityMessage: string = '';
  showQualityScore: boolean = false;

  constructor(private bugService: BugService, private stateService: StateService,
    private attachmentService: AttachmentService, private router: Router, private AddBug: AllBugsComponent) { }

  ngOnInit(): void {
    this.loadAllCategory();
    this.loadAllPriority();
    this.newBug.statusId = 3;
    this.newBug.created = this.formattedDateToSave;
    this.newBug.createdByUserId = 2;
    // this.newBug.description = " ";
    // this.newBug.title = " ";
  }
  onCheckDuplicates() {
    this.showDuplicateCheck = true;
  }
  changeShowSaveButton() {
    this.showSaveButton = !this.showSaveButton;
  }
  onContinueAddBug() {
    this.showDuplicateCheck = false;
    this.calculateQualityScore();

    if (!this.hasEnoughInfo()) return;

    // הצגת הפופאפ עם מידע על האיכות
    if (this.qualityScore === 90) {
      Swal.fire({
        title: 'איכות הבאג',
        html: `
        <p>ציון איכות: ${this.qualityScore}</p>
        <p>${this.qualityMessage}</p>
      `,
        icon: 'success',
        confirmButtonText: 'שמור'
      }).then((result) => {
        if (result.isConfirmed) {
          this.addBug(); // שמירה אם המשתמש לוחץ על "שמור"
        }
      });
    } else {
      Swal.fire({
        title: 'איכות הבאג',
        html: `
        <p>ציון איכות: ${this.qualityScore}</p>
        <p>${this.qualityMessage}</p>
      `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'שמור',
        cancelButtonText: 'שפר'
      }).then((result) => {
        if (result.isConfirmed) {
          this.addBug(); // שמירה אם המשתמש לוחץ על "שמור"
        } else {
          // כאן תוכל להוסיף לוגיקה לשיפור הבאג
          console.log('User chose to improve the bug report.');
        }
      });
    }
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
      await this.attachmentService.createAttachments(this.allAttachment, this.bugId);

      Swal.fire({ title: 'הבאג נשמר!', text: 'הבאג נוסף בהצלחה.', icon: 'success', confirmButtonText: 'אוקי' });
      this.AddBug.closePopup();
    } catch (error) {
      console.error('Error creating bug:', error);
      if (error.error) console.error('Error details:', error.error);
    }
  }
  onCancel() {
    Swal.fire({
      title: 'בטוח שברצונך לבטל?',
      text: 'כל השינויים לא יישמרו.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'כן, בטל',
      cancelButtonText: 'לא, השאר'
    }).then((result) => {
      if (result.isConfirmed) this.router.navigate(['/']);
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
    if (this.showAttachments === true) this.allAttachments();
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      await new Promise<void>((resolve) => video.onloadedmetadata = () => resolve());
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });
          this.allAttachment.push(file);
          this.fileUrls.push(this.getFileUrl(file));
          this.numDocuments++;
        }
        track.stop();
      }, 'image/png');
    } catch (err) {
      console.error('שגיאה בצילום מסך', err);
    }
  }
  async onRecordVideo() {
    if (this.showAttachments === true) this.allAttachments();
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0 && !confirm("השמע לא דלוק. האם אתה רוצה להמשיך בהקלטה בלי שמע?")) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      this.mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoFile = new File([blob], 'recording.webm', { type: 'video/webm' });
        console.log(videoFile);

        this.allAttachment.push(videoFile);
        this.fileUrls.push(this.getFileUrl(videoFile));
        this.numFilm++;
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
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files: FileList = input.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(file.size);
        // 30191664
        if (file.size > 27923020) {
          alert(`הקובץ ${file.name} גדול מדי ואינו יכול להיכנס.`)
          continue;
        }
        this.allAttachment.push(file);
        this.fileUrls.push(this.getFileUrl(file));
        if (file.type.startsWith('video/')) {
          this.numFilm++;
        } else {
          this.numDocuments++;
        }
      }
    }
  }
  onUploadClick(fileInput: HTMLInputElement) {
    if (this.showAttachments === true) this.allAttachments();
    fileInput.click();
  }
  getFileUrl(file: File) {
    return URL.createObjectURL(file);
  }
  removeFileByIndex(index: number) {
    const file = this.allAttachment[index];
    this.allAttachment.splice(index, 1);
    this.fileUrls.splice(index, 1);
    if (file.type.startsWith('video/')) {
      this.numFilm--;
    } else {
      this.numDocuments--;
    }
  }
  renameFile(index: number) {
    const newName = prompt("הכנס שם חדש לקובץ:", this.allAttachment[index].name);
    if (newName) {
      const file = this.allAttachment[index];
      const renamedFile = new File([file], newName, { type: file.type });
      this.allAttachment[index] = renamedFile;
    }
  }
  hasEnoughInfo(): boolean {
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
    return true;
  }
  calculateQualityScore(): void {
    let score = 0;  
    if (this.newBug.description != undefined) {
      const charCount = this.newBug.description.length;
      score += Math.min(Math.floor(charCount / 10) * 3, 30);
    }
    console.log("1 " + score);
    const keywords = /לדוגמא|כאשר|תמיד/;
    if (keywords.test(this.newBug.description)) score += 15;
    console.log("2 " + score);

    let image = 0, video = 0;

    for (let i = 0; i < this.allAttachment.length; i++) {
      const file = this.allAttachment[i];
      const fileType = file.type;
      if (fileType.startsWith('video/')) video++;
      else image++;
    }
    if (video > 0) score += 20;
    if (image > 0) score += 20;

    if (this.newBug.title!=undefined && this.newBug.title.length >= 10) score += 15; console.log("5 " + score);

    this.qualityScore = score;
    this.setQualityMessage();
  }
  setQualityMessage(): void {
    if (this.qualityScore < 50) {
      this.qualityMessage = 'חסר בדיווח מידע חשוב. מומלץ להוסיף תיאור מפורט או קבצים מצורפים';
    } else if (this.qualityScore < 80) {
      this.qualityMessage = 'דיווח סביר. ניתן לשפר על ידי תוספת פירוט או המחשה';
    } else {
      this.qualityMessage = 'דיווח מפורט וברור. תודה!';
    }
  }
  toggleQualityScore() {
    this.showQualityScore = !this.showQualityScore;
    this.calculateQualityScore();
  }
  closeQualityScore(): void {
  if (this.showQualityScore)
    this.showQualityScore = false;
  if(this.showAttachments)
    this.showAttachments = false;
  }
}