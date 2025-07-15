import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { ActivatedRoute } from '@angular/router';
import { AttachmentBugDto, BugDetalsDto, CategoryDto, PriorityDto, StatusDto, UpdateBugCommand } from 'src/app/web-api-client';
import { StateService } from 'src/app/services/state.service';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';
import { FileUpload } from 'src/app/models/FileUpload';

@Component({
  selector: 'app-bug-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploaderComponent],
  templateUrl: './bug-detail.component.html',
  styleUrl: './bug-detail.component.css'
})
export class BugDetailComponent implements OnInit {
  @Input() bug!: BugDetalsDto;
  @Input() AuthorizedUser!: boolean;
  @Output() bugChanged = new EventEmitter<any>();
  @Output() showFiles = new EventEmitter<number>();
  showPopup = false;
  closeReason = '';
  isEditMode = false;
  editedBug: BugDetalsDto = new UpdateBugCommand();
  priorities: Array<PriorityDto>
  categories: Array<CategoryDto>
  statuses: Array<StatusDto>
  selectedFiles: FileUpload[] = [];
  constructor(private bugService: BugService, public stateService: StateService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initState()
  }
  initState() {
    this.stateService.getAllPriority().subscribe(
      res => {
        this.priorities = res
      },
      err => console.error(err)
    )
    this.stateService.getAllCategories().subscribe(
      res => {
        this.categories = res
      },
      err => console.error(err)
    )
    this.stateService.getAllStatuses().subscribe(
      res => {
        this.statuses = res
      },
      err => console.error(err)
    )
  }
  onFilesChanged(files: FileUpload[]) {
    this.selectedFiles = files;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['bug'] && this.bug) {
      this.editedBug = Object.assign(new BugDetalsDto(), this.bug);
    }
  }

  toggleEdit() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.editedBug = Object.assign(new BugDetalsDto(), this.bug);
    this.isEditMode = false;
  }

  saveChanges() {
    const formData = new FormData();
    formData.append('bugId', this.bug.bugId.toString());
    formData.append('title', this.editedBug.title);
    formData.append('description', this.editedBug.description);
    formData.append('categoryId', this.editedBug.categoryId.toString());
    formData.append('priorityId', this.editedBug.priorityId.toString());
    formData.append('statusId', this.editedBug.statusId.toString());
    this.selectedFiles.forEach((attachment, index) => {
      formData.append(`Files[${index}].File`, attachment.file);
      formData.append(`Files[${index}].IsFilm`, attachment.isFilm.toString());
      if (attachment.attachmentId !== undefined) {
        formData.append(`Files[${index}].AttachmentId`, attachment.attachmentId.toString());
      }
    });

    this.bugService.updateBug(this.bug.bugId, formData).subscribe(
      {
        next: () => {
          this.bugChanged.emit();
          this.isEditMode = false;
        },
        error: err => console.error(err)
      }
    )
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

  checkPermissions(): void {
    // this.bugService.getCurrentUserPermissions(this.bug.bugId).subscribe(res => {
    //   this.isAuthorizedToComment = res.canComment;
    // });
  }

  onOverlayClick(event: MouseEvent): void {
    this.closePopup();
  }

  getStatusClassById(id: number): string {
    const status = this.statuses?.find(s => s.statusId === id);
    if (!status) return '';
    switch (status.statusName) {
      case 'Open': return 'status-open';
      case 'Close': return 'status-close';
      case 'Active': return 'status-active';
      case 'Cancelled': return 'status-cancelled';
      case 'Close without opening a bug': return 'status-close-without-opening'
      default: return '';
    }
  }
}
