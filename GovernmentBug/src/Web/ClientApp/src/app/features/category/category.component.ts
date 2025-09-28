import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from 'src/app/services/state.service';

interface Category {
  categoryId: number; // קוד הקטגוריה
  categoryName: string; // שם הקטגוריה
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'] // שים לב לשם הנכון של הקובץ
})
export class CategoryComponent {
  @Output() categorySelected = new EventEmitter();
  query: string = '';
  filteredItems: { name: string; id: number }[] = []; // עדכון לסוג של filteredItems
  isDropdownOpen: boolean = false;
  allCategory: Category[] = []; // עדכון לסוג של allCategory
  selectedCategoryId:number = 0;

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.loadAllCategory(); // טען את הקטגוריות
  }

  loadAllCategory() {
    this.stateService.getAllCategories().subscribe({
      next: categories => {
        this.allCategory = categories; // שמור את הקטגוריות
        this.filteredItems = categories.map(category => ({ name: category.categoryName, id: category.categoryId })); // שמור את שמות הקטגוריות והקודים
      },
      error: err => console.error('שגיאה בקבלת הCategory:', err)
    });
  }

  onInputChange() {
    const lowerQuery = this.query.toLowerCase();
    this.filteredItems = this.allCategory
      .filter(category => category.categoryName.toLowerCase().startsWith(lowerQuery)) // סנן לפי categoryName
      .map(category => ({ name: category.categoryName, id: category.categoryId })); // שמור את השמות והקודים
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectItem(item: { name: string; id: number }) {
    this.query = item.name; // עדכון השדה עם הקטגוריה הנבחרת
    this.selectedCategoryId = item.id; // שמור את הקוד של הקטגוריה הנבחרת
    this.categorySelected.emit(this.selectedCategoryId);
    this.filteredItems = []; // סגור את הרשימה
    this.isDropdownOpen = false; // ודא שהרשימה נסגרת לאחר הבחירה
    console.log('Selected Category ID:', this.selectedCategoryId); // תוכל להשתמש בקוד הקטגוריה לפי הצורך
  }
}
