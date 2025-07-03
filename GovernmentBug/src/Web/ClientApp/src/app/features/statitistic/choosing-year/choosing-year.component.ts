import { Component, EventEmitter, Output } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-choosing-year',
  standalone: true,
  imports: [NgFor],
  templateUrl: './choosing-year.component.html',
  styleUrl: './choosing-year.component.css'
})
export class ChoosingYearComponent {
  years: number[] = [];
  selectedYear: number = new Date().getFullYear();
  @Output() yearChange = new EventEmitter<number>();

  constructor() {
    const current = new Date().getFullYear();
    for (let y = current; y >= current - 10; y--) {
      this.years.push(y);
    }
  }

  onSelectChange(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.selectedYear = value;
    this.yearChange.emit(this.selectedYear); // שלח את השנה מיד בבחירה
  }
}
