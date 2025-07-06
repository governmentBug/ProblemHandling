import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { BugStatisticsClient, ByMonthsDto } from '../../../web-api-client';
import { MonthService } from '../dates.service';

@Component({
  selector: 'app-bugs-per-month',
  standalone: true,
  imports: [],
  templateUrl: './bugs-per-month.component.html',
  styleUrl: './bugs-per-month.component.css'
})
export class BugsPerMonthComponent implements OnInit {
  @Input() year: number = new Date().getFullYear();
  @ViewChild('bugChart', { static: true }) bugChartRef!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  constructor(private bugsStatisticsClient: BugStatisticsClient, private monthService: MonthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges() {
    this.loadData();
  }

  loadData() {
    console.log('Loading data for year:', this.year);
    if (!this.year) return;
    this.bugsStatisticsClient.getBugsByMonths(this.year).subscribe((data: ByMonthsDto) => {
      this.createChart(data);
    });
  }

  createChart(data: ByMonthsDto) {
    if (this.chart) {
      this.chart.destroy(); 
    }
    const months = this.monthService.getMonthNames();
    const bugsPerMonth = months.map((m, i) => data.byMonth?.[`${i + 1}`] || 0);
    this.chart = new Chart(this.bugChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'כמות באגים',
          data: bugsPerMonth,
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bug-bar-bg').trim() || '#3692ebcc',
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bug-bar-border').trim() || '#3692eb',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `כמות באגים לפי חודשים (${data.totalBugs} באגים בסה"כ)`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: false }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}
