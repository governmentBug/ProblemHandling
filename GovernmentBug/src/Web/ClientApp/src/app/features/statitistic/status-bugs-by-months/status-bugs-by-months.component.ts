import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { MonthService, YearService } from '../dates.service';
import { BugStatisticsClient, BugStatusByMonthsDTO } from 'src/app/web-api-client';
import { ChoosingDateComponent } from '../choosing-date/choosing-date.component';

@Component({
  selector: 'app-status-bugs-by-months',
  standalone: true,
  imports: [ChoosingDateComponent],
  templateUrl: './status-bugs-by-months.component.html',
  styleUrl: './status-bugs-by-months.component.css'
})
export class StatusBugsByMonthsComponent implements AfterViewInit,OnInit {
  constructor(public monthService: MonthService,
     public yearService: YearService,
     private bugStatisticsClient: BugStatisticsClient) {}
    ngOnInit(): void {
        this.loadData();
    }
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
    chart: Chart | undefined;
    byStatus: BugStatusByMonthsDTO;
    statusCountMap: { labels: string[], data: number[] } = { labels: [], data: [] };
    yearForStatus: number = new Date().getFullYear();
    monthForStatus: number = new Date().getMonth() + 1;
    bugStatusData: { labels: string[], data: number[] } = {
    labels: ['פתוח', 'בטיפול', 'בהמתנה', 'סגור'],
    data: [12, 7, 5, 2]
  };
  loadData()
  {
    this.bugStatisticsClient.getBugStatusByMonths
    (this.yearForStatus, this.monthForStatus)
    .subscribe((data: BugStatusByMonthsDTO) => {
      this.byStatus = data;
      // this.statusCountMap.labels = Object.keys(StatusBug).filter(k => isNaN(Number(k)));
      this.statusCountMap['Active'] = this.byStatus.activeBugs;
      this.statusCountMap['Open'] = this.byStatus.openBugs;
      this.statusCountMap['Closed'] = this.byStatus.closedBugs;
    });
  }
  onMonthForStatusChange(month: number) {
    this.monthForStatus = month;
    this.loadData();
  }
  onYearForStatusChange(year: number) {
    this.yearForStatus = year;
    this.loadData();
  }
  ngAfterViewInit() {
    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.bugStatusData.labels,
        datasets: [{
          data: this.bugStatusData.data,
          backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350'],
        }]
      },
      // data: {
      //   labels: Object.keys(this.byStatus.countByStatuses || {}),
      //   datasets: [{
      //     data: Object.values(this.byStatus.countByStatuses || {}),
      //     backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350'],
      //   }]
      // },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
