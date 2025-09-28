import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugStatisticsClient, ByUserDto } from 'src/app/web-api-client';
import { MonthlyTrendsComponent } from '../monthly-trends/monthly-trends.component';
import { PriorityBarChartComponent } from "../priority-bar-chart/priority-bar-chart.component";

@Component({
  selector: 'app-personal-statistics',
  standalone: true,
  imports: [MonthlyTrendsComponent, PriorityBarChartComponent],
  templateUrl: './personal-statistics.component.html',
  styleUrls: ['./personal-statistics.component.css'] // שם נכון של הקובץ הוא styleS ולא styleUrl
})
export class PersonalStatisticsComponent implements OnInit {
  @Input() userId: number = 1;
  showStats = false;
  showCharts = false;
  userData: ByUserDto;

  // ערכים להצגה עם אנימציית ספירה
  totalBugsDisplay = 0;
  treatBugsDisplay = 0;
  averageTreatmenTimeDisplay = 0;

  constructor(private bugStatisticsClient: BugStatisticsClient) {}

  ngOnInit(): void {
        // מציג placeholders בהתחלה
    this.showStats = false;
    this.showCharts = false;

    // אחרי 2 שניות מחליפים לתוכן אמיתי
    setTimeout(() => {
      this.showStats = true;
      this.showCharts = true;
    }, 1500);

    this.bugStatisticsClient.getByUser(this.userId).subscribe(data => {
      this.userData = data;

      // מתחילים את אנימציית הספירה אחרי שהנתונים הגיעו
      this.animateCount('totalBugsDisplay', data.totalBugs, 2000);
      this.animateCount('treatBugsDisplay', data.treatBugs, 2000);
      this.animateCount('averageTreatmenTimeDisplay', data.averageTreatmenTime, 2000);
    });
  }

  animateCount(prop: string, end: number, duration: number) {
    let start = 0;
    const stepTime = Math.max(Math.floor(duration / end), 20); // מינימום 20ms בין עדכון
    const timer = setInterval(() => {
      start += 1;
      this[prop] = start;
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
}
