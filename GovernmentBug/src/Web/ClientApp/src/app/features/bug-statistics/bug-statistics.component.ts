import { Component } from '@angular/core';
import { ChoosingYearComponent } from '../choosing-year/choosing-year.component';
import { BugsPerMonthComponent } from '../bugs-per-month/bugs-per-month.component';

@Component({
  selector: 'app-bug-statistics',
  standalone: true,
  imports: [ChoosingYearComponent, BugsPerMonthComponent],
  templateUrl: './bug-statistics.component.html',
  styleUrl: './bug-statistics.component.css'
})
export class BugStatisticsComponent {
  selectedYear: number = new Date().getFullYear();

  onYearChange(year: number) {
    this.selectedYear = year;
  }
}

