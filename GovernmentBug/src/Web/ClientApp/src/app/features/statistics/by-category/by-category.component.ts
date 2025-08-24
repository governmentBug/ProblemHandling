// import { Component, OnInit } from '@angular/core';
// import { BugStatisticsClient } from 'src/app/web-api-client';
// import { NgChartsModule } from 'ng2-charts';
// import { ChartData } from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { Chart } from 'chart.js';

// Chart.register(ChartDataLabels);

// @Component({
//   selector: 'app-by-category',
//   standalone: true,
//   imports: [NgChartsModule],
//   templateUrl: './by-category.component.html',
//   styleUrl: './by-category.component.css'
// })
// export class ByCategoryComponent implements OnInit {
//   totalBugs: number = 0;
//   pieChartData: ChartData<'pie', number[], string> = { labels: [], datasets: [] };
//   pieChartType: 'pie' = 'pie';
// pieChartOptions: any = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: { display: false },
//     datalabels: {
//       color: '#234',
//       font: { size: 20, weight: 'bold' },
//       anchor: 'end',
//       align: 'end',
//       offset: 40,
//       clip: false,
//       callout: {
//         display: true, // הפעלת החץ
//         borderColor: '#234', // צבע החץ
//         borderWidth: 2,
//         length: 20, // אורך החץ
//         padding: 0
//       },
//       formatter: (value: number, context: any) => {
//         const dataset = context.chart.data.datasets[0];
//         const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
//         const percent = total ? ((value / total) * 100).toFixed(1) : 0;
//         // שם + אחוז בשורה אחת
//         return `${percent}% ${context.chart.data.labels[context.dataIndex]}`;
//       }
//     }
//   },
//   elements: {
//     arc: {
//       borderWidth: 2,
//       borderColor: '#fff'
//     }
//   }
// };

//   constructor(private bugStatisticsClient: BugStatisticsClient) {}

//   ngOnInit() {
//     this.bugStatisticsClient.getByCategory().subscribe(data => {
//       this.totalBugs = data.totalBugs;
//       this.pieChartData = {
//         labels: Object.keys(data.byCategory),
//         datasets: [
//           {
//             data: Object.values(data.byCategory).map(x => Number(x)),
//             backgroundColor: [
//               '#ff5252', // אדום
//               '#2196f3', // כחול
//               '#4caf50', // ירוק
//               '#9c27b0', // סגול
//               '#F57C00',
//               '#FFC107',
//               '#FFEB3B'
//             ]
//           }
//         ]
//       };
//     });
//   }

// }

import { Component, OnInit } from '@angular/core';
import { BugStatisticsClient } from 'src/app/web-api-client';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-by-category',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './by-category.component.html',
  styleUrl: './by-category.component.css'
})
export class ByCategoryComponent implements OnInit {
  totalBugs: number = 0;
  pieChartData: ChartData<'pie', number[], string> = { labels: [], datasets: [] };
  pieChartType: 'pie' = 'pie';
  pieChartOptions: any = {
    // plugins: {
    //   legend: {
    //     display: false // הסתרת התגיות למעלה
    //   },
    //   datalabels: {

    //     color: '#111',
    //     font: (context: any) => {
    //       // ערך החלק הנוכחי
    //       const value = context.dataset.data[context.dataIndex] / this.totalBugs * 100;
    //       // אם הערך קטן מ-5, הפונט קטן יותר
    //       return {
    //         size: value < 5 ? '10vw' : '15vw'
    //       };
    //     },
    //     textAlign: 'center',
    //     borderRadius: 0,
    //     padding: 0,
    //     anchor: 'end', // שים את התגית מחוץ לפלח
    //     align: 'top',  // יישר את התגית מחוץ לגרף
    //     clip: false,   // אל תחתוך תגיות שיוצאות מהגרף
    //     offset: 0,     // ריווח מהגרף החוצה
    //     formatter: (_value: number, context: any) => {
    //       return context.chart.data.labels[context.dataIndex] + ':\n' + `${_value}%`;
    //     }
    //   }
    // },
     plugins: {
    legend: { display: false},
    datalabels: {
      color: '#234',
      font: { size: "10vw", weight: 'bold' },
      anchor: 'end',
      align: 'end',
      offset: 2,
      clip: false,
      callout: {
        display: true, // הפעלת החץ
        borderColor: '#234', // צבע החץ
        borderWidth: 2,
        length: 3, // אורך החץ
        padding: 0
      },
      formatter: (value: number, context: any) => {
        const dataset = context.chart.data.datasets[0];
        const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
        const percent = total ? ((value / total) * 100).toFixed(1) : 0;
        // שם + אחוז בשורה אחת
        return `${percent}% ${context.chart.data.labels[context.dataIndex]}`;
      }
    }
  },
    elements: {
      arc: {
        borderWidth: 3, // משפיע על עובי הגבול של כל פלח
        borderColor: '#fff'
      }
    }
  };
  constructor(private bugStatisticsClient: BugStatisticsClient) {}

  ngOnInit() {
    this.bugStatisticsClient.getByCategory().subscribe(data => {
      this.totalBugs = data.totalBugs;
      this.pieChartData = {
        labels: Object.keys(data.byCategory),
        datasets: [
          {
            data: Object.values(data.byCategory).map(x => Number(x)),
            backgroundColor: [
              '#ff5252', // אדום
              '#2196f3', // כחול
              '#4caf50', // ירוק
              '#9c27b0', // סגול
              '#F57C00',
              '#FFC107',
              '#FFEB3B'
            ]
          }
        ]
      };
    });
  }

}
