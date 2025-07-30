import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { NgChartsModule } from 'ng2-charts';
import { ByStatus } from 'src/app/models/byStatus.model';

@Component({
  selector: 'app-by-status',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './by-status.component.html',
  styleUrl: './by-status.component.css'
})
export class ByStatusComponent implements OnChanges {
  @Input() byStatus: ByStatus;

  pieChartLabels = ['פתוחים', 'בטיפול', 'נסגרו', 'בוטלו'];
  pieChartType = 'doughnut';
  pieChartData: any = {
    labels: this.pieChartLabels,
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#ff5252', '#2196f3', '#4caf50', '#9c27b0', '#F57C00'],
      hoverBackgroundColor: ['#ff7961', '#42a5f5', '#66bb6a', '#ab47bc', '#ff9800'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
      borderWidth: 2
    }]
  };
  pieChartOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      datalabels: {
        display: false
      }
    }
  };

  dataReady = false;

  animatedPercents = {
    openBugs: 0,
    activeBugs: 0,
    closedBugs: 0,
    cancelledBugs: 0,
    closeWithoutOpeningBugs: 0
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['byStatus'] && this.byStatus) {
      this.updateChartData();
      this.animatePercents();
      this.dataReady = true;
    }
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
          this.byStatus.cancelledBugs,
          this.byStatus.closeWithoutOpeningBugs
        ],
        backgroundColor: ['#ff5252', '#2196f3', '#4caf50', '#9c27b0', '#F57C00'],
        hoverBackgroundColor: ['#ff7961', '#42a5f5', '#66bb6a', '#ab47bc', '#ff9800'],
        hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
        hoverBorderWidth: 7
      }]
    };
  }

  animatePercents() {
    const total = this.byStatus?.totalBugs || 0;
    if (!total) return;
    this.animatePercent('openBugs', this.byStatus.openBugs, total);
    this.animatePercent('activeBugs', this.byStatus.activeBugs, total);
    this.animatePercent('closedBugs', this.byStatus.closedBugs, total);
    this.animatePercent('cancelledBugs', this.byStatus.cancelledBugs, total);
    this.animatePercent('closeWithoutOpeningBugs', this.byStatus.closeWithoutOpeningBugs, total);
  }

  animatePercent(key: keyof typeof this.animatedPercents, value: number, total: number) {
    const target = total ? Math.round((value / total) * 100) : 0;
    const duration = 3000; 
    const frameRate = 24;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;
    const step = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      this.animatedPercents[key] = Math.round(progress * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    step();
  }
}