import { Component, OnInit } from '@angular/core';
import { ChoosingYearComponent } from '../choosing-year/choosing-year.component';
import { BugsPerMonthComponent } from '../bugs-per-month/bugs-per-month.component';
import { OpenBugsStatComponent } from '../open-bugs-stat/open-bugs-stat.component';
import { BugStatisticsClient, OpenBugsByStatusDto, StatusBug } from 'src/app/web-api-client';

@Component({
  selector: 'app-bug-statistics',
  standalone: true,
  imports: [ChoosingYearComponent, BugsPerMonthComponent, OpenBugsStatComponent],
  templateUrl: './bug-statistics.component.html',
  styleUrl: './bug-statistics.component.css'
})
export class BugStatisticsComponent implements OnInit {
  constructor(private bugStatisticsClient: BugStatisticsClient) { }
  ngOnInit(): void {
    this.bugStatisticsClient.getOpenBugsStatus().subscribe((data: OpenBugsByStatusDto) => {
      this.byStatus = data;
      this.statusCountMap.labels = Object.keys(StatusBug).filter(k => isNaN(Number(k)));
      this.statusCountMap['Active'] = this.byStatus.activeBugs;
      this.statusCountMap['Open'] = this.byStatus.openBugs;
      this.statusCountMap['Closed'] = this.byStatus.closedBugs;
    });
  }
  selectedYear: number = new Date().getFullYear();
  byPriority: OpenBugsByStatusDto;
  byStatus: OpenBugsByStatusDto;
  statusCountMap: { labels: string[]; data: number[] } = { labels: [], data: [] };

  onYearChange(year: number) {
    this.selectedYear = year;
  }
}

