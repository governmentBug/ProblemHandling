import { Component, Input, OnChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ByPriorityDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-priority-bar-chart',
  templateUrl: './priority-bar-chart.component.html',
  styleUrls: ['./priority-bar-chart.component.css'],
  standalone: true,
  imports: [NgChartsModule]
})
export class PriorityBarChartComponent implements OnChanges {
  @Input() data: ByPriorityDto;

  public priorityLabels = ['נמוכה', 'בינונית', 'גבוהה', 'קריטית'];
  public priorities = ['low', 'medium', 'high', 'critical'];

  barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false, // חשוב! מאפשר התאמה מלאה לדיב
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#1976d2',
      bodyColor: '#333',
      borderColor: '#1976d2',
      borderWidth: 1
    },
    datalabels: { display: false }
  },
  scales: {
    x: {
      grid: { color: '#e3eaf2' },
      ticks: { color: '#1976d2', font: { size: 16} },
      title: { display: false }
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, color: '#1976d2', font: { size: 12 } },
      grid: { color: '#e3eaf2' },
      title: { display: false }
    }
  }
};

  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: this.priorityLabels,

    datasets: [{
      data: [],
      backgroundColor: ['#90caf9', '#64b5f6', '#1976d2', '#0d47a1'],
      borderRadius: 12,
      borderColor: '#1976d2',
      hoverBackgroundColor: ['#42a5f5', '#1976d2', '#1565c0', '#002171'],
      hoverBorderColor: '#1976d2',
      borderWidth: 0
    }]
  };

  ngOnChanges() {
    if (!this.data) {
      this.barChartData = {
        labels: this.priorityLabels,
        datasets: [{
          data: [],
          backgroundColor: ['#90caf9', '#64b5f6', '#1976d2', '#0d47a1'],
          borderRadius: 12,
          borderColor: '#1976d2',
          hoverBackgroundColor: ['#42a5f5', '#1976d2', '#1565c0', '#002171'],
          hoverBorderColor: '#1976d2',
          borderWidth: 0
        }]
      };
      return;
    }
    const counts = [
      this.data.low ?? 0,
      this.data.medium ?? 0,
      this.data.high ?? 0,
      this.data.critical ?? 0
    ];
    this.barChartData = {
      labels: this.priorityLabels,
      datasets: [{
      data: counts,
      backgroundColor: ['#90caf9', '#64b5f6', '#1976d2', '#0d47a1'],
      borderRadius: 12,
      borderColor: '#1976d2',
      hoverBackgroundColor: ['#42a5f5', '#1976d2', '#1565c0', '#002171'],
      hoverBorderColor: '#1976d2',
      borderWidth: 0
      }]
    };
  }
}
