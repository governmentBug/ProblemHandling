import { Component, OnInit } from '@angular/core';
import { Bug } from 'src/app/models/bug.model';
import { BugService } from 'src/app/services/bug.service';

@Component({
  selector: 'app-all-bugs',
  templateUrl: './all-bugs.component.html',
  styleUrls: ['./all-bugs.component.css']
})
export class AllBugsComponent implements OnInit {
  bugs: Bug[] = [];

  constructor(private bugService: BugService) {}

  ngOnInit(): void {
    this.bugService.getAllBugs().subscribe({
      next: bugs => this.bugs = bugs,
      error: err => console.error('שגיאה בקבלת הבאגים:', err)
    });
  }

  openDetails(bug: Bug) {
    console.log('פרטי באג:', bug);
  } 
}
