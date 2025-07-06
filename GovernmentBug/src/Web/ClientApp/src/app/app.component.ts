import { Component } from '@angular/core';
import { DemoComponent } from "./features/demo/demo.component";
import { AllBugsComponent } from "./features/all-bugs/all-bugs.component";
import { BugStatisticsComponent } from "./features/bug-statistics/bug-statistics.component";
import { NewBugComponent } from './features/new-bug/new-bug.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone:true,
  imports: [DemoComponent, AllBugsComponent, BugStatisticsComponent, NewBugComponent],
  
})
export class AppComponent {
  title = 'app';
}
