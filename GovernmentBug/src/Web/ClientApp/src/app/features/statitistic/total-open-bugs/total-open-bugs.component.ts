import { Component, OnInit } from '@angular/core';
import { BugStatisticsClient } from 'src/app/web-api-client';

@Component({
  selector: 'app-total-open-bugs',
  standalone: true,
  imports: [],
  templateUrl: './total-open-bugs.component.html',
  styleUrl: './total-open-bugs.component.css'
})
export class TotalOpenBugsComponent implements OnInit {
  totalOpenBugs: number = 0;

  constructor(private bugStatisticsClient: BugStatisticsClient) {}

  ngOnInit(): void {
    this.bugStatisticsClient.totalOpenBugs().subscribe({
      next: (data) => {
        this.totalOpenBugs = data;
      }
    });
  }
}
