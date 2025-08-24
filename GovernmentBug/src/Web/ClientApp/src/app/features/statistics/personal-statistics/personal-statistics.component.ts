import { Component, Input, OnInit } from '@angular/core';7
import { RouterLink } from '@angular/router';
import { BugStatisticsClient, ByUserDto } from 'src/app/web-api-client';
import { MonthlyTrendsComponent } from '../monthly-trends/monthly-trends.component';
import { PriorityBarChartComponent } from "../priority-bar-chart/priority-bar-chart.component";

@Component({
  selector: 'app-personal-statistics',
  standalone: true,
  imports: [MonthlyTrendsComponent, PriorityBarChartComponent, RouterLink],
  templateUrl: './personal-statistics.component.html',
  styleUrl: './personal-statistics.component.css'
})
export class PersonalStatisticsComponent implements OnInit {
 @Input() userId:number=1
  userData: ByUserDto
 
  constructor(private bugStatisticsClient: BugStatisticsClient) {}

  ngOnInit(): void {
    this.bugStatisticsClient.getByUser(this.userId).subscribe(data=>
      this.userData = data
    )
  }
}
