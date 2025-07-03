import { Component, OnInit } from '@angular/core';
import { BugService } from '../../services/bug.service';
import { Bug } from '../../models/bug.model';
import { BugDetailComponent } from "../bug-detail/BugDetailComponent";

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [BugDetailComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent implements OnInit {
  selectedBug: Bug
  constructor(public bugS: BugService) {
  }
  ngOnInit() {
    this.selectedBug = this.bugS.selectedBug;
  }
  
}
