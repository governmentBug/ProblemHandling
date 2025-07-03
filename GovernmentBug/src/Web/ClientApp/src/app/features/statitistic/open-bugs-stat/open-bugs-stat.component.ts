import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import Chart from 'chart.js/auto';
import { OpenBugsByStatusDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-open-bugs-stat',
  standalone: true,
  imports: [],
  templateUrl: './open-bugs-stat.component.html',
  styleUrl: './open-bugs-stat.component.css'
})
export class OpenBugsStatComponent implements AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;
  @Input()
   bugStatusData: { labels: string[], data: number[] } = {
    labels: ['פתוח', 'בטיפול', 'בהמתנה', 'סגור'],
    data: [12, 7, 5, 2]
  };

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
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
