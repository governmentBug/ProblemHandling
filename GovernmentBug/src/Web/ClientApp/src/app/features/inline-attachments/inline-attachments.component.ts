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
}
