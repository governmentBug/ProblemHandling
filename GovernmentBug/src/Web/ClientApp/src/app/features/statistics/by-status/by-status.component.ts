import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ByStatus } from 'src/app/models/byStatus.model';

@Component({
  selector: 'app-by-status',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './by-status.component.html',
  styleUrl: './by-status.component.css'
})
export class ByStatusComponent implements OnInit, OnChanges {
  @Input() byStatus: ByStatus;

  pieChartLabels = ['פתוחים', 'בטיפול', 'נסגרו', 'בוטלו'];
  pieChartType = 'doughnut';
  pieChartData: any = {
    labels: this.pieChartLabels,
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#ff5252', '#2196f3', '#4caf50', '#9c27b0']
    }]
  };
  pieChartOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false }
    }
  };

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges() {
    this.updateChartData();
  }

  updateChartData() {
    if (!this.byStatus) return;
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [{
        data: [
          this.byStatus.openBugs,
          this.byStatus.activeBugs,
          this.byStatus.closedBugs,
          this.byStatus.cancelledBugs
        ],
        backgroundColor: ['#ff5252', '#2196f3', '#4caf50', '#9c27b0']
      }]
    };
  }
}