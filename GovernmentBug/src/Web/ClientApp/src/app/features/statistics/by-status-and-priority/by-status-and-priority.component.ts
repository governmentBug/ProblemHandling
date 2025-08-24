import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { ByStatusDto } from 'src/app/web-api-client';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-by-status-and-priority',
  standalone: true,
  imports: [NgChartsModule, NgStyle],
  templateUrl: './by-status-and-priority.component.html',
  styleUrl: './by-status-and-priority.component.css'
})
export class ByStatusAndPriorityComponent implements OnInit, OnChanges, OnDestroy {

  @Input() byStatusAndPriority: ByStatusDto;
  private firstLoad = true;
  private currentStatusIndex = 0;
  public barChartType: ChartType = 'bar';
  public barChartLabels: string[] = ['פתוחים', 'בטיפול', 'נסגרו', 'בוטלו','נסגרו מבלי להיפתח'];
  public barChartData: ChartData<'bar'>['datasets'] = [];
  private statusMainColors = [
    '#D32F2F',
    '#1565C0', 
    '#388E3C', 
    '#7B1FA2' , 
    '#F57C00'
  ];

  private legendBaseColors = [
    '#D32F2F', 
    '#1565C0', 
    '#388E3C', 
    '#7B1FA2', 
    '#F57C00' 
  ];
  public priorityLabels = ['נמוכה', 'בינונית', 'גבוהה', 'קריטית'];
  public legendColors: string[] = [];
  private legendInterval: any;
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      datalabels: { display: false },
      legend: { display: false },
      tooltip: {
        titleColor: '#222',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        mode: 'index',
        intersect: false,
      }
    },
    elements: {
      bar: {
        borderRadius: 10,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          color: '#222',
          font: { size: 14 },
          stepSize: 5
        }
      }
    }
  };

ngOnInit() {
  this.setLegendColors();
  this.legendInterval = setInterval(() => {
    this.currentStatusIndex = (this.currentStatusIndex + 1) % this.legendBaseColors.length;
    this.setLegendColors();
  }, 3000);
}

  ngOnDestroy() {
    clearInterval(this.legendInterval);
  }

  ngOnChanges() {
    this.updateChartData();
  }

updateChartData() {
  if (!this.byStatusAndPriority) return;
  const statusKeys = ['openBugs', 'activeBugs', 'closeBugs', 'cancelledBugs','closeWithoutOpeningBugs'];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const priorityAlphas = [0.2, 0.4, 0.7, 1];

  // אפס את הנתונים קודם כדי להכריח רענון
  this.barChartData = [];

  setTimeout(() => {
    this.barChartData = priorities.map((priority, i) => ({
      label: this.priorityLabels[i],
      backgroundColor: this.statusMainColors.map(color => this.withAlpha(color, priorityAlphas[i])),
      borderColor: this.statusMainColors.map(color => this.withAlpha(color, priorityAlphas[i])),
      data: statusKeys.map(status => this.byStatusAndPriority[status]?.[priority] ?? 0),
      hoverBackgroundColor: this.statusMainColors.map(color => this.withAlpha(color, 1)),
      hoverBorderColor:'#fff',
      hoverBorderWidth: 1
    }));

    if (this.firstLoad) {
      this.barChartOptions = {
        ...this.barChartOptions,
        animation: { duration: 1200 }
      };
      this.firstLoad = false;
    } else {
      this.barChartOptions = {
        ...this.barChartOptions,
        animation: { duration: 500 }
      };
    }
  }, 50);
}

setLegendColors() {
  const baseColor = this.legendBaseColors[this.currentStatusIndex];
  const alphas = [0.2, 0.4, 0.7, 1];
  this.legendColors = alphas.map(alpha => this.withAlpha(baseColor, alpha));
}

  withAlpha(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}