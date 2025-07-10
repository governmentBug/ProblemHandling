import { Component, OnInit } from '@angular/core';
import { ChoosingDateComponent } from '../choosing-date/choosing-date.component';
import { BugsPerMonthComponent } from '../bugs-per-month/bugs-per-month.component';
import { BugStatusByMonthsDTO } from 'src/app/web-api-client';
import { YearService } from '../dates.service';
import { StatusBugsByMonthsComponent } from '../status-bugs-by-months/status-bugs-by-months.component';
import { TotalOpenBugsComponent } from '../total-open-bugs/total-open-bugs.component';
import { OpenBugsByPriorityComponent } from "../open-bugs-by-priority/open-bugs-by-priority.component";

@Component({
  selector: 'app-bug-statistics',
  standalone: true,
  imports: [ChoosingDateComponent,
    BugsPerMonthComponent,
    StatusBugsByMonthsComponent,
    TotalOpenBugsComponent, OpenBugsByPriorityComponent],
  templateUrl: './bug-statistics.component.html',
  styleUrl: './bug-statistics.component.css'
})
export class BugStatisticsComponent implements OnInit {
  constructor(
     public yearService: YearService) { }
  ngOnInit(): void {

  }
  selectedYear: number = new Date().getFullYear();
  byPriority: BugStatusByMonthsDTO;
  onYearChange(year: number) {
    this.selectedYear = year;
  }
}

