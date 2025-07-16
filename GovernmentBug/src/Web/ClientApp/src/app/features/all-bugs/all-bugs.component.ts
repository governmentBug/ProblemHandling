import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bug } from 'src/app/models/bug.model';
import { BugService } from 'src/app/services/bug.service';
import { CommentService } from 'src/app/services/Comment.service';
import { ActivatedRoute } from '@angular/router';
import { BugDetalsDto, CommentsBugDto } from 'src/app/web-api-client';
import { BugDetailComponent } from "../bug-detail/BugDetailComponent";
import { StateService } from 'src/app/services/state.service';
import { CommentPanelComponent } from '../comment-panel/comment-panel.component';

@Component({
  selector: 'app-all-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, BugDetailComponent, CommentPanelComponent],
  templateUrl: './all-bugs.component.html',
  styleUrls: ['./all-bugs.component.css']
})
export class AllBugsComponent implements OnInit {
  allBugs: BugDetalsDto[] = [];
  bugs: BugDetalsDto[] = [];

  currentPage = 1;
  pageSize = 15;

  selectedFilterType: string = '';
  selectedFilterValue: string = '';

  searchText: string = '';
  selectedBug: BugDetalsDto
  comments: CommentsBugDto[] = [];
  isCommentsPanelOpen = true;
  isAuthorizedToComment = true;
  filterOptions: { [key: string]: string[] } = {};
  sortDirections: { [key: string]: 'desc' | 'asc' } = {};
  readonly priorityOrder: Record<string, number> = {
    'נמוכה': 1,
    'בינונית': 2,
    'גבוהה': 3,
    'קריטית': 4
  };

  constructor(private bugService: BugService, private stateService: StateService, public CommentService: CommentService, public route: ActivatedRoute) { }
  ngOnInit(): void {
    this.loadAllBugs();
    this.loadFilterOptions();
  }

  loadAllBugs() {
    this.bugService.getAllBugs().subscribe({
      next: bugs => {
        this.allBugs = bugs;
        this.applyFilterAndPage();
      },
      error: err => console.error('שגיאה בקבלת הבאגים:', err)
    });
  }

  loadFilterOptions() {
    this.stateService.getAllStatuses().subscribe({
      next: statuses => {
        this.filterOptions['statusName'] = statuses.map(s => s.statusName);
      },
      error: err => console.error('שגיאה בסטטוסים:', err)
    });

    this.stateService.getAllPriority().subscribe({
      next: priorities => this.filterOptions['priorityName'] = priorities.map(p => p.priorityName),
      error: err => console.error('שגיאה בעדיפויות:', err)
    });

    this.stateService.getAllCategories().subscribe({
      next: categories => this.filterOptions['categoryName'] = categories.map(c => c.categoryName),
      error: err => console.error('שגיאה בקטגוריות:', err)
    });
  }

  private dateMatchesSearch(date: Date | string, search: string): boolean {
    if (!date || !search) return false;

    const d = new Date(date);
    const normalizedSearch = search.trim().toLowerCase();

    const parts = [
      d.toLocaleDateString('he-IL'),
      d.toISOString().split('T')[0],
      d.getFullYear().toString(),
      (d.getMonth() + 1).toString().padStart(2, '0'),
      d.toLocaleString('he-IL', { month: 'long' }),
      d.getDate().toString().padStart(2, '0')
    ];

    return parts.some(p => p.toLowerCase().includes(normalizedSearch));
  }

  applyFilterAndPage() {
    let filtered = this.allBugs;

    if (this.selectedFilterType && this.selectedFilterValue) {
      filtered = filtered.filter(bug => {
        const field = bug[this.selectedFilterType as keyof Bug];
        return String(field).toLowerCase() === this.selectedFilterValue.toLowerCase();
      });
    }

    if (this.searchText && this.searchText.trim() !== '') {
      const searchTextLower = this.searchText.toLowerCase();
      filtered = filtered.filter(bug =>
        bug.title?.toLowerCase().includes(searchTextLower) ||
        bug.description?.toLowerCase().includes(searchTextLower) ||
        bug.createdByUserFullName?.toLowerCase().includes(searchTextLower) ||
        (bug.createdDate && this.dateMatchesSearch(bug.createdDate, this.searchText))
      );
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.bugs = filtered.slice(start, end);
  }


  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (!this.selectedFilterType) {
      this.selectedFilterType = value;
      this.selectedFilterValue = '';
    } else {
      this.selectedFilterValue = value;
      this.currentPage = 1;
      this.applyFilterAndPage();
    }
  }

  resetFilter() {
    this.selectedFilterType = '';
    this.selectedFilterValue = '';
    this.currentPage = 1;
    this.applyFilterAndPage();
  }

  getFilteredCount(): number {
    if (this.selectedFilterType && this.selectedFilterValue) {
      return this.allBugs.filter(bug =>
        String(bug[this.selectedFilterType as keyof Bug]).toLowerCase() === this.selectedFilterValue.toLowerCase()
      ).length;
    }
    return this.allBugs.length;
  }

  nextPage() {
    const maxPage = Math.ceil(this.getFilteredCount() / this.pageSize);
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.applyFilterAndPage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPage();
    }
  }

  getBugById(id: number) {
    this.bugService.getBugById(id).subscribe({
      next: updatedBug => {
        this.selectedBug = updatedBug;
        const indexAll = this.allBugs.findIndex(b => b.bugId === updatedBug.bugId);
        if (indexAll !== -1) {
          this.allBugs[indexAll] = updatedBug;
        }

        const indexFiltered = this.bugs.findIndex(b => b.bugId === updatedBug.bugId);
        if (indexFiltered !== -1) {
          this.bugs[indexFiltered] = updatedBug;
        }

        this.loadComments();
      },
      error: err => {
        console.error('שגיאה בשליפת באג:', err);
      }
    });
  }
  onBugChanged() {
    if (this.selectedBug) {
      this.getBugById(this.selectedBug.bugId);
    }
  }

  loadComments(): void {
    this.CommentService.getCommentsByBugId(this.selectedBug.bugId).subscribe({
      next: (res) => {
        this.comments = res
        console.log(res);

      },
      error: (err) => console.error('שגיאה בשליפת תגובות', err)
    });
  }

  addComment(commentText: string): void {
    this.CommentService.addComment(this.selectedBug.bugId, commentText).subscribe({
      next: () => this.loadComments(),
      error: (err) => console.error('שגיאה בהוספת תגובה', err)
    });
  }

  checkPermissions(): void {
    // this.bugService.getCurrentUserPermissions(this.bug.bugId).subscribe(res => {
    //   this.isAuthorizedToComment = res.canComment;
    // });
  }

  openCommentsPanel(): void {
    this.isCommentsPanelOpen = true;
  }

  onCommentAdded(content: string): void {
    this.addComment(content)
  }

  onCommentDeleted(commentId: number): void {
    this.CommentService.deleteComment(commentId).subscribe(() => {
      this.loadComments();
    });
  }

  onClosePanel(): void {
    this.isCommentsPanelOpen = false;
  }
  toggleBug(bug: BugDetalsDto, event: MouseEvent): void {
    event.stopPropagation();

    if (this.selectedBug?.bugId === bug.bugId) {
      this.selectedBug = null;
      this.isCommentsPanelOpen = false;
    } else {
      this.selectedBug = bug;
      this.getBugById(bug.bugId);
      this.isCommentsPanelOpen = true;
    }
  }
  // מאפיין לשמירת כיוון מיון לכל עמודה

  sort(column: string) {
    if (!this.allBugs.length) return;

    this.sortDirections[column] = this.sortDirections[column] === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirections[column];

    this.allBugs.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (column === 'priorityName') {
        const numA = this.priorityOrder[valA];
        const numB = this.priorityOrder[valB];
        return direction === 'asc' ? numA - numB : numB - numA;
      }
      const dateA = new Date(valA);
      const dateB = new Date(valB);

      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return direction === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      if (typeof valA === 'string') {
        return direction === 'asc'
          ? valA.localeCompare(valB, undefined, { sensitivity: 'base' })
          : valB.localeCompare(valA, undefined, { sensitivity: 'base' });
      }

      return direction === 'asc' ? valA - valB : valB - valA;
    });

    this.applyFilterAndPage();
  }
}