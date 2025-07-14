import { Component, OnInit } from '@angular/core';
import { ByStatus } from 'src/app/models/byStatus.model';
import { BugStatisticsClient, ByStatusDto } from 'src/app/web-api-client';
import { ByStatusComponent } from "../by-status/by-status.component";
import { ByStatusAndPriorityComponent } from "../by-status-and-priority/by-status-and-priority.component";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ByStatusComponent, ByStatusAndPriorityComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  byStatusDto:ByStatusDto;
  byStatus:ByStatus;
  constructor(private bugStatisticsClient:BugStatisticsClient) {}

  ngOnInit(): void {
    this.bugStatisticsClient.getByStatus().subscribe(data => {
      this.byStatusDto = data;
      this.byStatus = new ByStatus(
        data.totalBugs,
        data.openBugs.total,
        data.closeBugs.total,
        data.activeBugs.total,
        data.cancelledBugs.total
      );
    });
  }

  // Add methods to handle component logic, such as fetching data or responding to user actions

}
