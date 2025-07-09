import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { ActivatedRoute } from '@angular/router';
import { BugDetalsDto, CategoryDto, PriorityDto, StatusDto, UpdateBugCommand } from 'src/app/web-api-client';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-bug-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bug-detail.component.html',
  styleUrl: './bug-detail.component.css'
})
export class BugDetailComponent implements OnInit {
  @Input() bug!: BugDetalsDto;
  @Input() AuthorizedUser!: boolean;
  @Output() bugChanged = new EventEmitter<any>();

  showPopup = false;
  closeReason = '';
  isEditMode = false;
  editedBug: BugDetalsDto = new UpdateBugCommand();

  // רשימות לבחירה
  priorities: Array<PriorityDto>
  categories: Array<CategoryDto>
  statuses: Array<StatusDto>
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
    const dtoToSend = {
      title: this.editedBug.title,
      description: this.editedBug.description,
      categoryId: this.editedBug.categoryId,
      priorityId: this.editedBug.priorityId,
      statusId: this.editedBug.statusId
    };
    this.bugService.updateBug(this.bug.bugId, dtoToSend).subscribe(
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
      default: return '';
    }
  }
}