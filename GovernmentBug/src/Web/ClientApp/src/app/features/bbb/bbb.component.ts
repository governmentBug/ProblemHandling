import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bbb',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './bbb.component.html',
  styleUrl: './bbb.component.css'
})
export class BbbComponent {
  query: string = '';
  selectedItem: string = '';
  items: string[] = [];
  filteredItems: string[] = [];

  ngOnInit() {
    this.items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);
    this.filteredItems = this.items;
  }

  onInputChange() {
    const lowerQuery = this.query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.toLowerCase().startsWith(lowerQuery)
    );
  }

  selectItem(item: string) {
    this.selectedItem = item;
    this.query = item;
    this.filteredItems = []; // סגור את הרשימה
  }
}