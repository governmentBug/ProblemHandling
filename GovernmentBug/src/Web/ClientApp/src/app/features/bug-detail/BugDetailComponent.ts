import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { ActivatedRoute } from '@angular/router';
import { AttachmentBugDto, BugDetalsDto, CategoryDto, PriorityDto, StatusDto, UpdateBugCommand } from 'src/app/web-api-client';
import { StateService } from 'src/app/services/state.service';
import { FileUpload } from 'src/app/models/FileUpload';
import { InlineAttachmentsComponent } from "../inline-attachments/inline-attachments.component";
import { AttachmentService } from 'src/app/services/Attachment.Service';

@Component({
  selector: 'app-bug-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, InlineAttachmentsComponent],
  templateUrl: './bug-detail.component.html',
  styleUrl: './bug-detail.component.css'
})
export class BugDetailComponent implements OnInit {
  @Input() bug!: BugDetalsDto;
  @Input() AuthorizedUser!: boolean;
  @Output() bugChanged = new EventEmitter<any>();
  @Output() showFiles = new EventEmitter<number>();
  @Output() isEditModeChanged = new EventEmitter<boolean>()

  showPopup = false;
  closeReason = '';
  isEditMode = false;
  attachmentsEditMode = false; // חדש!
  editedBug: BugDetalsDto = new UpdateBugCommand();
  priorities: Array<PriorityDto> = [];
  categories: Array<CategoryDto> = [];
  statuses: Array<StatusDto> = [];
  showAttachments = false;
  filesToAdd: File[] = [];
  filesToDelete: number[] = [];

  constructor(private bugService: BugService, public stateService: StateService, private attachmentService: AttachmentService) { }

  ngOnInit(): void {
    this.initState();
  }

  initState() {
    this.stateService.getAllPriority().subscribe(
      res => this.priorities = res,
      err => console.error(err)
    );
    this.stateService.getAllCategories().subscribe(
      res => this.categories = res,
      err => console.error(err)
    );
    this.stateService.getAllStatuses().subscribe(
      res => this.statuses = res,
      err => console.error(err)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bug'] && this.bug) {
      this.editedBug = Object.assign(new BugDetalsDto(), this.bug);
    }
  }

  onFilesChanged(data: { newFiles: File[], deletedFileIds: number[] }) {
    this.filesToAdd = [...this.filesToAdd, ...data.newFiles];
    this.filesToDelete = [...this.filesToDelete, ...data.deletedFileIds];
  }

  toggleEdit() {
    this.isEditMode = true;
    this.attachmentsEditMode = true; // הצגת העלאת קבצים בזמן עריכה
    this.isEditModeChanged.emit(this.isEditMode);
  }

  cancelEdit() {
    this.editedBug = Object.assign(new BugDetalsDto(), this.bug);
    this.isEditMode = false;
    this.attachmentsEditMode = false; // ביטול גם בקבצים
    this.isEditModeChanged.emit(this.isEditMode);
  }

  saveChanges() {
    const dtoToSend = {
      title: this.editedBug.title,
      description: this.editedBug.description,
      categoryId: this.editedBug.categoryId,
      priorityId: this.editedBug.priorityId,
      statusId: this.editedBug.statusId
    };
    this.bugService.updateBug(this.bug.bugId, dtoToSend).subscribe({
      next: () => {
        if (this.filesToAdd.length > 0) {
          this.attachmentService.createAttachments(this.filesToAdd, this.bug.bugId);
        }
        for (const id of this.filesToDelete) {
          this.attachmentService.deleteAttachment(id).subscribe();
        }
        this.bugChanged.emit();
        this.isEditMode = false;
        this.isEditModeChanged.emit(this.isEditMode);
        this.attachmentsEditMode = true; // ממשיכים לאפשר עריכת קבצים אחרי שמירה
      },
      error: err => console.error(err)
    });
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.closeReason = '';
  }

  submitClose() {
    if (!this.closeReason.trim()) {
      alert('אנא מלא סיבה לסגירה');
      return;
    }
    this.bugService.updateBugAndClosed(this.bug.bugId, this.closeReason).subscribe({
      next: () => {
        this.bugChanged.emit(null);
        this.closePopup();
      },
      error: err => console.error(err)
    });
  }

  onOverlayClick(event: MouseEvent): void {
    this.closePopup();
  }

  getStatusClassById(id: number): string {
    const status = this.statuses?.find(s => s.statusId === id);
    if (!status) return '';
    switch (status.statusName) {
      case 'פתוח': return 'status-open';
      case 'סגור': return 'status-close';
      case 'פעיל': return 'status-active';
      case 'בוטל': return 'status-cancelled';
      case 'נסגר מבלי להיפתח': return 'status-close-without-opening';
      default: return '';
    }
  }
}
