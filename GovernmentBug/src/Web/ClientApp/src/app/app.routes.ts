import { Routes } from '@angular/router';
import { BugStatisticsComponent } from './features/statitistic/bug-statistics/bug-statistics.component';
import { AllBugsComponent } from './features/all-bugs/all-bugs.component';
import { DemoComponent } from './features/demo/demo.component';
import { NewBugComponent } from './features/new-bug/new-bug.component';

export const routes: Routes = [
  { path: '', component: AllBugsComponent },
  { path: 'statistics', component: BugStatisticsComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'addBug', component: NewBugComponent },

];
