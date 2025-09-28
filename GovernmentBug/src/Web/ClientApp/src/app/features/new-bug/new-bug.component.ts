import { Component, OnInit, ViewChild } from '@angular/core';
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
import * as JSZip from 'jszip';
import { CategoryComponent } from '../category/category.component';

@Component({
  selector: 'app-new-bug',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchSameBugsComponent, CategoryComponent],
  templateUrl: './new-bug.component.html',
  styleUrls: ['./new-bug.component.css']
})
export class NewBugComponent implements OnInit {
  // @ViewChild(CategoryComponent) categoryComponent!: CategoryComponent;
  createdDate: Date = new Date();
  formattedDate: string = this.createdDate.toLocaleDateString();
  formattedDateToSave: string = this.createdDate.toISOString();
  public newBug: AbbBug = new AbbBug();
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
  donTitel: boolean = false;
  umountDiscripsion: number = 0;
  donDiscripsion: boolean = false;
  oneVidio: boolean = false;
  oneAttachment: boolean = false;
  constructor(private bugService: BugService, private stateService: StateService,
    private attachmentService: AttachmentService, private AddBug: AllBugsComponent) { }


  ngOnInit(): void {
    this.loadAllPriority();
    this.newBug.statusId = 3;
    this.newBug.created = this.formattedDateToSave;
    this.newBug.createdByUserId = 2;
  }
  onChangeCategory(categoryId: number) {
    this.newBug.categoryId = categoryId;
  }
  onCheckDuplicates() {
    this.showDuplicateCheck = true;
  }
  changeShowSaveButton() {
    this.showSaveButton = !this.showSaveButton;
  }
  onContinueAddBug() {
    // this.newBug.categoryId = this.categoryComponent.selectedCategoryId
    // this.newBug.categoryId = this.categoryId;
    this.showDuplicateCheck = false;
    this.setQualityMessage();

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
    this.newBug.qualityScore = this.qualityScore;

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
      if (result.isConfirmed) this.AddBug.closePopup();
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
      if (this.oneAttachment === false) {
        this.qualityScore += 20;
        this.oneAttachment = true;
      }
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
    this.setQualityMessage()
  }
  async onRecordVideo() {
    if (this.showAttachments === true) this.allAttachments();
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (this.oneVidio === false) {
        this.qualityScore += 20;
        this.oneVidio = true;
      }
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
        this.allAttachment.push(videoFile);
        this.fileUrls.push(this.getFileUrl(videoFile));
        this.numFilm++;
      };
      this.mediaRecorder.start();
      setTimeout(() => this.stopRecording(), 90000);

    } catch (err) {
      console.error('שגיאה בהקלטת וידאו', err);
    }
    this.setQualityMessage();
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
        if (file.size > 25 * 1024 * 1024) { // בדוק אם הקובץ גדול מ-25MB
          const zip = new JSZip();
          zip.file(file.name, file); // הוסף את הקובץ ל-ZIP

          // שמור את ה-ZIP אם יש קבצים כבדים
          zip.generateAsync({ type: 'blob' })
            .then(content => {
              const zipBlobUrl = URL.createObjectURL(content);
              const zipFileName = file.name.replace(/\.[^/.]+$/, "") + '.zip'; // שם הקובץ ZIP
              this.allAttachment.push(new File([content], zipFileName));
              this.fileUrls.push(zipBlobUrl);
            })
            .catch(error => {
              this.qualityScore -= 20;
              alert('שגיאה ביצירת קובץ ה-ZIP: ' + error.message);
            });
        } else {
          // הוסף קבצים קלים לרשימה להעלאה בנפרד
          this.allAttachment.push(file);
          this.fileUrls.push(this.getFileUrl(file));
        }

        if (file.type.startsWith('video/')) {
          this.numFilm++;
          if (this.oneVidio === false) {
            this.qualityScore += 20;
            this.oneVidio = true;
          }
        } else {
          this.numDocuments++;
          if (this.oneAttachment === false) {
            this.qualityScore += 20;
            this.oneAttachment = true;
          }
        }
      }
    }
    this.setQualityMessage();
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
    if (file.name.endsWith('.zip')) {
      this.checkZipContent(file)
    }
    if (file.type.startsWith('video/')) {
      this.numFilm--;
      if (this.numFilm === 0) {
        console.log(this.numFilm);
        this.qualityScore -= 20;
        this.oneVidio = false;
      }
    } else {
      this.numDocuments--;
      if (this.numDocuments === 0) {
        this.qualityScore -= 20;
        this.oneAttachment = false;
      }
    }
    this.allAttachment.splice(index, 1);
    this.fileUrls.splice(index, 1);
    this.setQualityMessage();
  }
  checkZipContent(file) {
    const zip = new JSZip();
    zip.loadAsync(file).then((contents) => {
      Object.keys(contents.files).forEach((filename) => {
        const fileType = filename.split('.').pop(); // קבלת הסיומת

        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
          this.numDocuments--;
          if (this.numDocuments === 0) {
            this.qualityScore -= 20;
            this.oneAttachment = false;
          }
        } else if (['mp4', 'mov', 'avi'].includes(fileType.toLowerCase())) {
          this.numFilm--;
          if (this.numFilm === 0) {
            console.log(this.numFilm);
            this.qualityScore -= 20;
            this.oneVidio = false;
          }
        }
      });
    }).catch((error) => {
      console.error("שגיאה בטעינת קובץ ה-ZIP:", error);
    });
  }
  renameFile(index: number) {
    const originalFileName = this.allAttachment[index].name;
    const nameWithoutExtension = originalFileName.replace(/\.[^/.]+$/, ""); // הסרת הסיומת
    const newName = prompt("הכנס שם חדש לקובץ:", nameWithoutExtension);

    if (newName) {
      const file = this.allAttachment[index];
      const extension = originalFileName.split('.').pop(); // קבלת הסיומת המקורית
      const renamedFile = new File([file], newName + '.' + extension, { type: file.type });
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
  addPointTitle(): void {
    if (this.newBug.title != undefined && this.newBug.title.length >= 10 && this.donTitel === false) {
      this.donTitel = true;
      this.qualityScore += 15;
    }
    if (this.newBug.title != undefined && this.newBug.title.length < 10 && this.donTitel === true) {
      this.donTitel = false
      this.qualityScore -= 15;
    }
    this.setQualityMessage();
  }
  addPointDescription(): void {
    let nowUmount = 0;
    if (this.newBug.description != undefined) {
      const charCount = this.newBug.description.length;
      nowUmount += Math.min(Math.floor(charCount / 10) * 3, 30);
    }
    if (this.umountDiscripsion < nowUmount) {
      this.qualityScore += Math.abs(nowUmount - this.umountDiscripsion);
      this.umountDiscripsion = nowUmount;
    }
    if (this.umountDiscripsion > nowUmount) {
      this.qualityScore -= Math.abs(nowUmount - this.umountDiscripsion);
      this.umountDiscripsion = nowUmount;
    }

    const keywords = /לדוגמא|כאשר|תמיד/;
    if (keywords.test(this.newBug.description) && this.donDiscripsion === false) {
      this.qualityScore += 15;
      this.donDiscripsion = true;
    }
    if (keywords.test(this.newBug.description) === false && this.donDiscripsion === true) {
      this.qualityScore -= 15;
      this.donDiscripsion = false;
    }
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
  isFileType(fileName: string, extensions: string[]): boolean {
  const lowerCaseFileName = fileName.toLowerCase();
  return extensions.some(extension => lowerCaseFileName.endsWith(extension));
}

}