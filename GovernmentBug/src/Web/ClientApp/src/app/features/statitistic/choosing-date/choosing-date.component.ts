import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-choosing-date',
  standalone: true,
  imports: [NgFor],
  templateUrl: './choosing-date.component.html',
  styleUrl: './choosing-date.component.css'
})
export class ChoosingDateComponent {
  @Input() arr:  [number, string][] = [];
  @Input() title: string = 'בחר שנה';
  selected: number = 0;
  @Output() dateChange = new EventEmitter<number>();

  constructor() {
    // const current = new Date().getFullYear();
    // for (let y = current; y >= current - 10; y--) {
    //   this.years.push(y);
    // }
  }

  onSelectChange(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.selected = value;
    this.dateChange.emit(this.selected);
  }
}
