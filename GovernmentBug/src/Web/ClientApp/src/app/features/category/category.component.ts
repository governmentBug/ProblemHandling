import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'] // שים לב לשם הנכון של הקובץ
})
export class CategoryComponent {
  query: string = '';
  filteredItems: string[] = [];
  isDropdownOpen: boolean = false;
  allCategory: any[] = [];

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.loadAllCategory(); // טען את הקטגוריות
  }

  loadAllCategory() {
    this.stateService.getAllCategories().subscribe({
      next: categories => {
        this.allCategory = categories; // שמור את הקטגוריות
        this.filteredItems = categories.map(category => category.categoryName); // שמור את שמות הקטגוריות
        console.log(this.allCategory);
      },
      error: err => console.error('שגיאה בקבלת הCategory:', err)
    });
  }

  onInputChange() {
    const lowerQuery = this.query.toLowerCase();
    this.filteredItems = this.allCategory
      .filter(category => category.categoryName.toLowerCase().startsWith(lowerQuery)) // סנן לפי categoryName
      .map(category => category.categoryName); // שמור רק את השמות
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectItem(item: string) {
    this.query = item; // עדכון השדה עם הקטגוריה הנבחרת
    this.filteredItems = []; // סגור את הרשימה
    this.isDropdownOpen = false; // ודא שהרשימה נסגרת לאחר הבחירה
  }
}
