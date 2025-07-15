import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttachmentService } from 'src/app/services/Attachment.Service';
import { AttachmentBugDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-pannel-attacments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pannel-attacments.component.html',
  styleUrl: './pannel-attacments.component.css'
})
export class PannelAttacmentsComponent implements OnInit {
  @Input() bugId: number;
  files: Array<AttachmentBugDto > = [];
  @Output() close = new EventEmitter<void>();

  constructor(public attachService: AttachmentService) { }

 ngOnInit() {
  if (this.bugId) {
    this.attachService.getAttachmentsBug(this.bugId).subscribe({
      next: (attachments) => {
        this.files = attachments
        this.files.map(f=>{
          f.url=this.attachService.createPreviewUrl(this.attachService.base64ToUint8Array(f.filePath),f.fileType)
        })
      },
      error: (err) => console.error('שגיאה בשליפת קבצים', err)
    });
  }
}
  closePanel() {
    this.close.emit();
  }
}
