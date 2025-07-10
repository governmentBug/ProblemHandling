import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BugsClient, BugStatisticsClient, OpenBugsByPriorityDto } from 'src/app/web-api-client';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-open-bugs-by-priority',
  standalone: true,
  imports: [],
  templateUrl: './open-bugs-by-priority.component.html',
  styleUrl: './open-bugs-by-priority.component.css'
})
export class OpenBugsByPriorityComponent implements OnInit {
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;
  priorities: string[] = [];
  counts: number[] = [];

  constructor(private bugsStatisticService: BugStatisticsClient) {}

  ngOnInit(): void {
    this.bugsStatisticService.getOpenBugsByPriority().subscribe((data: OpenBugsByPriorityDto) => {
      if (data && data.properties) {
        this.priorities = Object.keys(data.properties);
        this.counts = Object.values(data.properties);
        this.renderChart();
      }
    });
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.priorities,
        datasets: [{
          data: this.counts,
          backgroundColor: ['#ffcc00', '#ff9900', '#ff3300', '#cc0000'],
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
