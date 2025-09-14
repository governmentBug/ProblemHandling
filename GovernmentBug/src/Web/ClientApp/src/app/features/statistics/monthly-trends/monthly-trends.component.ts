import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { BugStatisticsClient, CategoryDto } from '../../../web-api-client'
import { StateService } from 'src/app/services/state.service';
import { CategoryComponent } from "../../category/category.component";

@Component({
  selector: 'app-monthly-trends',
  standalone: true,
  imports: [NgChartsModule, ReactiveFormsModule, CommonModule, FormsModule, CategoryComponent],
  templateUrl: './monthly-trends.component.html',
  styleUrl: './monthly-trends.component.css'
})
export class MonthlyTrendsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() userId: number = null;
  @Input() displayCategorySelector: boolean = true;
  months: string[] = [];
  bugCounts: number[] = [];
  loading = false;
  currentYearBack: number = 0;
  currentYear: number = new Date().getFullYear(); // שנה נוכחית להצגה
  categories: CategoryDto[] = [];
  selectedCategory: number = null;
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'כמות באגים',
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33,150,243,0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#2196f3'
      }
    ]
  };

  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: { display: false },
      legend: { display: false }
    },
    scales: {
      x: { 
        title: { display: false },
      },
      y: { 
        beginAtZero: true, 
        title: { display: true, text: 'כמות באגים', align: 'start' }
      }
    },
  };
  constructor(private bugStatisticsClient: BugStatisticsClient,private stateService: StateService) {}

  ngOnInit() {
    this.stateService.getAllCategories().subscribe(categories => {
        this.categories = categories;
    });
      this.loadYear();
  }


  loadYear() {
    this.loading = true;
    this.bugStatisticsClient.getByMonths(this.selectedCategory, this.userId, this.currentYearBack)
      .subscribe(data => {
        const monthNames = [
          'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
          'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
        ];
        this.months = [];
        this.bugCounts = [];
        const now = new Date();
        let lastMonth = now.getMonth();
        let lastYear = now.getFullYear() - this.currentYearBack;
        this.currentYear = lastYear; // עדכון השנה הנוכחית להצגה
        for (let i = data.byMonth.length - 1; i >= 0; i--) {
          this.months.unshift(monthNames[lastMonth]); // רק שם החודש
          this.bugCounts.unshift(data.byMonth[lastMonth]);
          lastMonth--;
          if (lastMonth < 0) {
            lastMonth = 11;
            lastYear--;
          }
        }
        this.lineChartData.labels = [...this.months];
        this.lineChartData.datasets[0].data = [...this.bugCounts];
        this.chart?.update();
        this.loading = false;
      });
  }

  loadPreviousMonths() {
    this.currentYearBack++;
    this.loadYear();
  }

  loadNextMonths() {
    if (this.currentYearBack === 0) return;
    this.currentYearBack--;
    this.loadYear();
  }
  
  onCategoryChange(categoryId: any) {
    this.selectedCategory = categoryId;
    console.log("Selected Category ID in MonthlyTrendsComponent:", this.selectedCategory);
    this.loadYear();
  }
}

