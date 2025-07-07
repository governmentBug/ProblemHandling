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

  ngOnInit() {
    if (this.title.includes('חודש')) {
      this.selected = new Date().getMonth() + 1;
    } else if (this.title.includes('שנה')) {
      this.selected = new Date().getFullYear();
    }
  }

  onSelectChange(event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.selected = value;
    this.dateChange.emit(this.selected);
  }
}
