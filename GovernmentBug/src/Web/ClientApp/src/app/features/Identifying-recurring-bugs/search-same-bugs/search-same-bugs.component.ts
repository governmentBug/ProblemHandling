import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugsClient, BugComparisonQuery, BugSummariesDto, BugDetalsDto } from 'src/app/web-api-client';
import { ListBugsSummariesComponent } from '../list-bugs-summaries/list-bugs-summaries.component';
import { BugDetailComponent } from 'src/app/features/bug-detail/BugDetailComponent';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-search-same-bugs',
  standalone: true,
  imports: [CommonModule, ListBugsSummariesComponent, BugDetailComponent],
  templateUrl: './search-same-bugs.component.html',
  styleUrl: './search-same-bugs.component.css'
})
export class SearchSameBugsComponent {
// @Input() BugComparisonQuery: BugComparisonQuery = new BugComparisonQuery();
bugComparisonQuery: BugComparisonQuery = new BugComparisonQuery({
  title: 'פרטי באג לא נקלט',
  description: 'string',
  categoryId: 1
});

// Example field, replace with actual fields
  recurringBugs: BugSummariesDto[] = [];
  showDrawer = false;
  message = '';
  loading = false;
  selectedBug: BugDetalsDto | null = null;
  showBugPopup = false;
  authorizedUser: boolean = false; // ניתן לעדכן לפי הרשאות בפועל

  constructor(private bugsClient: BugsClient,
    private router: Router,
    private stateService: StateService
  ) {}

 async searchRecurringBugs() {
  this.loading = true;
  await firstValueFrom(this.stateService.getAllStatuses()); // ודא שהסטטוסים נטענו
  this.bugsClient.identifyingRecurringBugs(this.bugComparisonQuery).subscribe({
    next: (result) => {
      this.loading = false;
      if (result && result.length > 0) {
        result.forEach(bug => {
          bug.statusName = this.stateService.getStatusById(bug.statusId);
        });
        this.recurringBugs = result;
        this.message = `נמצאו ${result.length} באגים חוזרים!`;
        this.showDrawer = true;
      } else {
        this.message = '';
        this.showDrawer = false;
      }
    },
    error: () => {
      this.loading = false;
      this.message = 'אירעה שגיאה בחיפוש.';
      this.showDrawer = false;
    }
  });
}
  closeDrawer() {
    this.showDrawer = false;
  }
  onViewBug(id: number) {
    if (id === -1) {
      this.closeDrawer();
      return;
    }
    // Navigate to the bug detail page
   // this.router.navigate(['/bug-detail', id]);
    this.loading = true;
    this.bugsClient.getBugDetialsByID(id).subscribe({
      next: (bug) => {
        this.selectedBug = bug;
        this.showBugPopup = true;
        this.loading = false;
      },
      error: () => {
        this.message = 'שגיאה בשליפת פרטי הבאג.';
        this.loading = false;
      }
    });
  }

  closeBugPopup() {
    this.showBugPopup = false;
    this.selectedBug = null;
  }
}
