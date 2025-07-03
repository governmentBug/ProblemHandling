import { Component,Input } from '@angular/core';
import { Bug } from '../../models/bug.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-bug-detail',
    standalone:true,
    imports: [CommonModule,FormsModule],
    templateUrl: './bug-detail.component.html',
    styleUrl: './bug-detail.component.css'
})
export class BugDetailComponent {
  @Input() bug!: Bug;
  showPopup = false;
  closeReason = '';

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.closeReason = '';
  }

  submitClose() {
    if (!this.closeReason.trim()) {
      alert('אנא מלא סיבה לסגירה');
      return;
    }

    // שליחת הסיבה לשרת או הדפסתה
    console.log('סיבה לסגירת הבאג:', this.closeReason);

    // סגירת הפופאפ
    this.closePopup();
  }
}


