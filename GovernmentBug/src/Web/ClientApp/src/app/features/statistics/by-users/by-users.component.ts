import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { BugStatisticsClient, ByUsersDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-by-users',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './by-users.component.html',
  styleUrl: './by-users.component.css'
})
export class ByUsersComponent implements OnInit {
  @Input() byUsersData: ByUsersDto;
  title = 'פילוח לפי משתמשים';
  barChartData: any;
  ngOnInit(): void {
    this.barChartData = {
      labels: this.byUsersData?.usersName || [],
      datasets: [
        {
          label: 'באגים שטופלו',
          data: this.byUsersData?.treatedBugs || [],
          backgroundColor: '#2196f3',
          hoverBackgroundColor: '#1976d2'
        },
        {
          label: 'באגים פתוחים',
          data: this.byUsersData?.totalBugs || [],
          backgroundColor: '#bbdefb',
          hoverBackgroundColor: '#ddebf7ff'
        }
      ]
    };
  }

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      },
      title: {
        display: false
      }
    },
    scales: {
      x: { 
        stacked: true,
        grid: { display: false, drawBorder: true }
      },
      y: { 
        stacked: true,
        grid: { display: false, drawBorder: true }
      }
    },
    elements: {
      bar: {
        borderRadius: 10,
      }
    },
  };
}
