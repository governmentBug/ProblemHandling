import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AttachmentService } from 'src/app/services/Attachment.Service';
import { AttachmentBugDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-inline-attachments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inline-attachments.component.html',
  styleUrls: ['./inline-attachments.component.css']
})
export class InlineAttachmentsComponent implements OnInit {
  @Input() bugId!: number;
  @Input() isEditMode: boolean = false;
  @Output() filesChanged = new EventEmitter<{ newFiles: File[]; deletedFileIds: number[] }>();

  files: AttachmentBugDto[] = [];
  newFiles: File[] = [];
  deletedFileIds: number[] = [];

  constructor(public attachmentService: AttachmentService) { }

  ngOnInit(): void {
    this.loadFiles();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['bugId'] && this.bugId) {
      this.loadFiles()
    }
  }
  loadFiles(): void {
    this.attachmentService.getAttachmentsByBug(this.bugId).subscribe(files => {
      this.files = files;
      this.files.forEach(f => {
        this.attachmentService.getFileContent(f.attachmentId).subscribe(blob => {
          const objectUrl = URL.createObjectURL(blob);
          console.log('blob loaded for file:', f.fileName, 'URL:', objectUrl, blob);
          f.url = objectUrl;
        });
      });
    });
  }


  onFileSelected(event: any): void {
    const selectedFiles: File[] = Array.from(event.target.files);
    this.newFiles.push(...selectedFiles);

    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        var a = new AttachmentBugDto()
        a.bugId = this.bugId,
          a.fileName = file.name,
          a.fileType = file.type,
          a.url = preview
        this.files.push(a);
      };
      reader.readAsDataURL(file);
    });
    this.emitChanges();
    event.target.value = '';
  }

  deleteAttachment(attachmentId: number): void {
    const index = this.files.findIndex(f => f.attachmentId === attachmentId);
    if (index > -1) {
      this.files.splice(index, 1);
      if (attachmentId !== 0) this.deletedFileIds.push(attachmentId);
    }
    this.emitChanges();
  }

  emitChanges(): void {
    this.filesChanged.emit({ newFiles: this.newFiles, deletedFileIds: this.deletedFileIds });
  }
  // הקלטת מסך
async onRecordVideo() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], 'recording.webm', { type: 'video/webm' });

      this.newFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        const a = new AttachmentBugDto();7
        a.attachmentId=0
        a.bugId = this.bugId;
        a.fileName = file.name;
        a.fileType = file.type;
        a.url = preview;
        this.files.push(a);
        this.emitChanges();
      };
      reader.readAsDataURL(file);
    };

    mediaRecorder.start();

    // אפשר להפסיק אחרי X שניות אוטומטית אם רוצים
    setTimeout(() => mediaRecorder.stop(), 5000); // הקלטה של 5 שניות לדוגמה

  } catch (err) {
    console.error('שגיאה בהקלטת וידאו', err);
  }
}

// צילום מסך
async onScreenshot() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];

    const video = document.createElement('video');
    video.style.display = 'none';
    video.srcObject = stream;
    video.play();

    await new Promise<void>((resolve) => {
      video.onloadedmetadata = () => resolve();
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'screenshot.png', { type: 'image/png' });
        this.newFiles.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string;
          const a = new AttachmentBugDto();
          a.bugId = this.bugId;
          a.fileName = file.name;
          a.fileType = file.type;
          a.url = preview;
          this.files.push(a);
          this.emitChanges();
        };
        reader.readAsDataURL(file);
      }
      track.stop();
    }, 'image/png');
  } catch (err) {
    console.error('שגיאה בצילום מסך', err);
  }
}
// 
selectedFile: AttachmentBugDto | null = null;

openPopup(file: AttachmentBugDto) {
  this.selectedFile = file;
}

closePopup() {
  this.selectedFile = null;
}
  renameFile(index: number) {
  const newName = prompt("הכנס שם חדש לקובץ:", this.files[index].fileName);
  if (newName) {
    this.files[index].fileName = newName;
    this.emitChanges();
  }
}
}
