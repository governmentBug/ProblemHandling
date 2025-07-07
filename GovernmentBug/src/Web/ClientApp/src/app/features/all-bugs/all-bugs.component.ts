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

  filterOptions = {
    statusName: ['Open', 'Closed', 'Active', 'Cancelled'],
    priorityName: ['Low', 'Medium', 'High', 'Critical'],
    categoryName: ['UI', 'Backend', 'API']
  };

  constructor(private bugService: BugService) { }

  ngOnInit(): void {
    this.loadAllBugs();
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

  applyFilterAndPage() {
    let filtered = this.allBugs;

    if (this.selectedFilterType && this.selectedFilterValue) {
      filtered = this.allBugs.filter(bug => {
        const field = bug[this.selectedFilterType as keyof Bug];
        return field === this.selectedFilterValue;
      });
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
      return this.allBugs.filter(bug => bug[this.selectedFilterType as keyof Bug] === this.selectedFilterValue).length;
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
