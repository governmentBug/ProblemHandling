import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { BugStatisticsClient } from 'src/app/web-api-client';
import { NgChartsModule } from 'ng2-charts';;

const LeaderLinePlugin = {
  id: 'leaderLine',
  afterDraw(chart: any) {
    if (chart.canvas.id !== 'categoryPieChart') return;
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((arc: any, index: number) => {
      const angle = (arc.startAngle + arc.endAngle) / 2;
      const radius = arc.outerRadius;
      const lineDistance = 15; // התאמה למיקום התגיות

      const x = arc.x + Math.cos(angle) * radius;
      const y = arc.y + Math.sin(angle) * radius;

      const lineX = arc.x + Math.cos(angle) * (radius + lineDistance);
      const lineY = arc.y + Math.sin(angle) * (radius + lineDistance);

      const label = chart.config.data.labels[index];
      const value = chart.config.data.datasets[0].data[index];

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(lineX, lineY);
      ctx.strokeStyle = 'gray';
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = (lineX < arc.x ? 'right' : 'left');
      ctx.textBaseline = 'middle';
      ctx.fillText(`${label}: ${value}`, lineX + (lineX < arc.x ? -5 : 5), lineY);
    });
  }
};

@Component({
  selector: 'app-by-category',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './by-category.component.html',
  styleUrls: ['./by-category.component.css']
})
export class ByCategoryComponent implements OnInit {
  constructor(private bugStatisticsClient: BugStatisticsClient) {}

  ngOnInit() {
    this.bugStatisticsClient.getByCategory().subscribe(data => {
      this.pieChartData = {
        labels: Object.keys(data.byCategory),
        datasets: [
          {
            data: Object.values(data.byCategory).map(x => Number(x)),
            backgroundColor: [
              '#ff5252', '#2196f3', '#4caf50', '#9c27b0',
              '#F57C00', '#FFC107', '#FFEB3B'
            ],
            hoverBackgroundColor: [
              '#ff867f', '#64b5f6', '#81c784', '#ba68c8',
              '#ffb74d', '#ffd54f', '#fff176'
            ],
            borderColor: 'white',
            borderWidth: 0,
            hoverBorderColor: 'white',
            hoverBorderWidth: 2
          }
        ]
      };
    });
  }

  pieChartType: 'pie' = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]>;
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false, // שומר על פרופורציה
    layout: {
      padding: 30 // מקום לתגיות
    },
    plugins: {
      legend: { display: false }
    }
  };

  public myPieChartPlugins = [LeaderLinePlugin];
}
