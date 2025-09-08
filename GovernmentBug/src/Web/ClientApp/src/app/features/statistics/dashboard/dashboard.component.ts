import { Component, OnInit } from '@angular/core';
import { ByStatus } from 'src/app/models/byStatus.model';
import { BugStatisticsClient, ByStatusDto, ByUsersDto } from 'src/app/web-api-client';
import { ByStatusComponent } from "../by-status/by-status.component";
import { ByStatusAndPriorityComponent } from "../by-status-and-priority/by-status-and-priority.component";
import { MonthlyTrendsComponent } from "../monthly-trends/monthly-trends.component";
import { ByCategoryComponent } from "../by-category/by-category.component";
import { RouterLink } from '@angular/router';
import { ByUsersComponent } from "../by-users/by-users.component";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ByStatusComponent, ByStatusAndPriorityComponent, MonthlyTrendsComponent, ByCategoryComponent, RouterLink, ByUsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  byStatusDto:ByStatusDto;
  byStatus:ByStatus;
  byUsers:ByUsersDto;
  showCharts = false;
  constructor(private bugStatisticsClient:BugStatisticsClient) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.showCharts = true;
    }, 1000);
    this.bugStatisticsClient.getByStatus().subscribe(data => {
      this.byStatusDto = data;
      this.byStatus = new ByStatus(
        data.totalBugs,
        data.openBugs.total,
        data.closeBugs.total,
        data.activeBugs.total,
        data.cancelledBugs.total,
        data.closeWithoutOpeningBugs.total
      );
    });
    this.bugStatisticsClient.getByUsers().subscribe(data => {
      this.byUsers = data;
    });
  }
}
