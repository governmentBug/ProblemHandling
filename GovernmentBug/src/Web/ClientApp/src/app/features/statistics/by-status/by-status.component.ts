import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ByStatus } from 'src/app/models/byStatus.model';

@Component({
  selector: 'app-by-status',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './by-status.component.html',
  styleUrls: ['./by-status.component.css']
})
export class ByStatusComponent implements OnChanges {
  @Input() byStatus: ByStatus;

  pieChartLabels = ['פתוחים', 'בטיפול', 'נסגרו', 'בוטלו', 'נסגר מבלי להיפתח'];
  pieChartType: 'doughnut' = 'doughnut';
  pieChartData = this.getPieChartData([0, 0, 0, 0, 0]);

 pieChartOptions = {
  cutout: '70%',
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    datalabels: { display: false },
  }
};


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
    }
  }

  getPieChartData(data: number[]): any {
    return {
      labels: this.pieChartLabels,
      datasets: [{
        data,
        backgroundColor: ['#ff5252', '#2196f3', '#4caf50', '#9c27b0', '#F57C00'],
        hoverBackgroundColor: ['#ff7961', '#42a5f5', '#66bb6a', '#ab47bc', '#ff9800'],
        hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
        borderWidth: 2,
        hoverBorderWidth: 5
      }]
    };
  }

  updateChartData() {
    if (!this.byStatus) return;
    this.pieChartData = this.getPieChartData([
      this.byStatus.openBugs,
      this.byStatus.activeBugs,
      this.byStatus.closedBugs,
      this.byStatus.cancelledBugs,
      this.byStatus.closeWithoutOpeningBugs
    ]);
  }

  animatePercents() {
    const total = this.byStatus?.totalBugs || 0;
    if (!total) return;

    Object.keys(this.animatedPercents).forEach(key => {
      this.animatePercent(key as keyof typeof this.animatedPercents, this.byStatus[key as keyof ByStatus], total);
    });
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
      if (progress < 1) requestAnimationFrame(step);
    };
    step();
  }
}
