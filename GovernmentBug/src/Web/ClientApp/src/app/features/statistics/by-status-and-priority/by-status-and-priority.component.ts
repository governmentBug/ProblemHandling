import { Component, Input, AfterViewInit } from '@angular/core';
import { ByStatusDto } from 'src/app/web-api-client';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-by-status-and-priority',
  standalone: true,
  imports: [],
  templateUrl: './by-status-and-priority.component.html',
  styleUrl: './by-status-and-priority.component.css'
})
export class ByStatusAndPriorityComponent implements AfterViewInit {
  @Input() byStatusAndPriority: ByStatusDto;

  ngAfterViewInit() {
    if (!this.byStatusAndPriority) return;

    // דוגמה למבנה נתונים:
    // byStatusAndPriority = {
    //   open: { total: 10, low: 2, medium: 3, high: 4, critical: 1 },
    //   active: {...}, closed: {...}, cancelled: {...}
    // }

    const statuses = ['פתוחים', 'בטיפול', 'נסגרו', 'בוטלו'];
    const statusKeys = ['openBugs', 'activeBugs', 'closedBugs', 'cancelledBugs'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    const priorityLabels = ['נמוכה', 'בינונית', 'גבוהה', 'קריטית'];
    const colors = ['#90caf9', '#fff176', '#ff8a65', '#e57373'];

    // בניית מערך לכל עדיפות
    const datasets = priorities.map((priority, i) => ({
      label: priorityLabels[i],
      backgroundColor: colors[i],
      data: statusKeys.map(status => this.byStatusAndPriority[status]?.[priority] ?? 0)
    }));

    new Chart('statusPriorityChart', {
      type: 'bar',
      data: {
        labels: statuses,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'התפלגות באגים לפי סטטוס ועדיפות'
          }
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    });
  }
}
