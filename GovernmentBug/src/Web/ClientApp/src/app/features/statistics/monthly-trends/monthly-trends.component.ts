import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { BugStatisticsClient } from '../../../web-api-client'

@Component({
  selector: 'app-monthly-trends',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './monthly-trends.component.html',
  styleUrl: './monthly-trends.component.css'
})
export class MonthlyTrendsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  months: string[] = [];
  bugCounts: number[] = [];
  loading = false;
  currentYearBack: number = 0; // 0 = שנה נוכחית, 1 = שנה אחת אחורה וכו'

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'כמות באגים',
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33,150,243,0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#2196f3'
      }
    ]
  };

  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { title: { display: false} },
      y: { 
        beginAtZero: true, 
        title: { display: true, text: 'כמות באגים', align: 'start' } // align למעלה
      }
    }
  };

  constructor(private bugStatisticsClient: BugStatisticsClient) {}

  ngOnInit() {
    this.loadYear();
  }


  // טוען שנה אחורה (12 חודשים אחורה מהשנה הנוכחית פחות currentYearBack)
  loadYear() {
    this.loading = true;
    this.bugStatisticsClient.getByMonths(null, null, this.currentYearBack)
      .subscribe(data => {
        const monthNames = [
          'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
          'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
        ];
        this.months = [];
        this.bugCounts = [];
        const now = new Date();
        let lastMonth = now.getMonth();
        let lastYear = now.getFullYear() - this.currentYearBack;
        for (let i = data.byMonth.length - 1; i >= 0; i--) {
          this.months.unshift(monthNames[lastMonth] + ' ' + lastYear);
          this.bugCounts.unshift(data.byMonth[lastMonth]);
          lastMonth--;
          if (lastMonth < 0) {
            lastMonth = 11;
            lastYear--;
          }
        }
        console.log(`Loaded data for ${this.currentYearBack} months:`, this.months, this.bugCounts);
        this.lineChartData.labels = [...this.months];
        this.lineChartData.datasets[0].data = [...this.bugCounts];
        this.chart?.update();
        this.loading = false;
      });
  }

  loadPreviousMonths() {
    this.currentYearBack++;
    this.loadYear();
  }

  loadNextMonths() {
    if (this.currentYearBack === 0) return; // לא ניתן לעבור לשנה עתידית
    this.currentYearBack--;
    this.loadYear();
  }

  updateChart() {
    this.lineChartData.labels = [...this.months];
    this.lineChartData.datasets[0].data = [...this.bugCounts];
    this.chart?.update();
  }
}

