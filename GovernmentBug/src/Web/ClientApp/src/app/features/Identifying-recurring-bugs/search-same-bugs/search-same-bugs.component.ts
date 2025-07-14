import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugsClient, BugComparisonQuery, BugSummariesDto, BugDetalsDto } from 'src/app/web-api-client';
import { ListBugsSummariesComponent } from '../list-bugs-summaries/list-bugs-summaries.component';
import { BugDetailComponent } from 'src/app/features/bug-detail/BugDetailComponent';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
import { BugStatisticsClient } from 'src/app/web-api-client';
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
  avaragedTime: string = '';
  loading = false;
  selectedBug: BugDetalsDto | null = null;
  showBugPopup = false;
  authorizedUser: boolean = false; // ניתן לעדכן לפי הרשאות בפועל

  constructor(
    private bugsClient: BugsClient,
    private router: Router,
    private stateService: StateService,
    private bugStatisticsClient: BugStatisticsClient
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
        this.message = `יתכן שכבר קיים באג דומה במערכת`;
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
  cancelOpenBug() {
    this.showDrawer = false;

    this.router.navigate(['']);
  }
  async continueOpenBug() {
    this.message = '';
    this.showDrawer = false;
    // נשתמש ב-priorityId ו-categoryId מתוך הבאג שנבחר או מתוך הבאג להשוואה
    const priorityId = this.selectedBug?.priorityId || 1;
    const categoryId = this.selectedBug?.categoryId || this.bugComparisonQuery.categoryId || 1;
    const created = this.selectedBug?.createdDate ? new Date(this.selectedBug.createdDate) : new Date();
    try {
      const avgTime = await firstValueFrom(this.bugStatisticsClient.averageTreatmentTime(priorityId, categoryId, created));
      if(avgTime==-1) {
              this.avaragedTime = '.אין מספיק נתונים כדי לחשב זמן ממוצע לטיפול בבאג';
      } else {
          this.avaragedTime = `זמן ממוצע לטיפול בבאג מסוג זה: ${this.formatDuration(avgTime)}`;
      }
      console.log('זמן ממוצע לטיפול בבאג:', this.avaragedTime);
    } catch {
      this.avaragedTime = 'לא ניתן לחשב זמן ממוצע לטיפול בבאג.';
    }
  }

  formatDuration(minutes: number): string {
    if (!minutes || minutes < 1) return 'פחות מדקה';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    let str = '';
    if (hours > 0) str += `${hours} שעות `;
    if (mins > 0) str += `${mins} דקות`;
    return str.trim();
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
