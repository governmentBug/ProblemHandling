import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bug } from 'src/app/models/bug.model';
import { BugService } from 'src/app/services/bug.service';

@Component({
  selector: 'app-all-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-bugs.component.html',
  styleUrls: ['./all-bugs.component.css']
})
export class AllBugsComponent implements OnInit {
  allBugs: Bug[] = [];
  bugs: Bug[] = [];

  currentPage = 1;
  pageSize = 15;

  selectedFilterType: string = '';
  selectedFilterValue: string = '';

  searchText: string = '';

  filterOptions: { [key: string]: string[] } = {};

  constructor(private bugService: BugService) { }

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
    this.bugService.getStatuses().subscribe({
      next: statuses => this.filterOptions['statusName'] = statuses,
      error: err => console.error('שגיאה בסטטוסים:', err)
    });

    this.bugService.getPriorities().subscribe({
      next: priorities => this.filterOptions['priorityName'] = priorities,
      error: err => console.error('שגיאה בעדיפויות:', err)
    });

    this.bugService.getCategories().subscribe({
      next: categories => this.filterOptions['categoryName'] = categories,
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
}
