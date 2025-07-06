import { Component } from '@angular/core';
import { AbbBug } from 'src/app/models/addBug.model';
import { BugService } from 'src/app/services/bug.service';
import { FormsModule } from '@angular/forms'; // ייבוא של FormsModule

@Component({
  selector: 'app-new-bug',
  standalone: true,
  imports: [FormsModule], // הוספת FormsModule כאן
  templateUrl: './new-bug.component.html',
  styleUrls: ['./new-bug.component.css'] // תיקון ל-styleUrls
})
export class NewBugComponent {
  constructor(private bugService: BugService) { }

  createdDate: Date = new Date();
 formattedDate: string = this.createdDate.toLocaleDateString(); // מציג תאריך בפורמט מקומי

// // או אם אתה רוצה פורמט מסוים
//  formattedDate: string = this.createdDate.toISOString().split('T')[0]; // מציג תאריך בפורמט YYYY-MM-DD

  public newBug: AbbBug = new AbbBug(
    "כותרת הבאג",
    "תיאור הבאג",
    '1',
    9,
    "2023-10-01 00:00:00",
    0,
  );

  addBug() {
    console.log(this.newBug);

    this.bugService.createBug(this.newBug).subscribe(response => {
      console.log('Bug created:', response);
    }, error => {
      console.error('Error creating bug:', error);
      if (error.error) {
        console.error('Error details:', error.error);
      }
    });
  }
}
