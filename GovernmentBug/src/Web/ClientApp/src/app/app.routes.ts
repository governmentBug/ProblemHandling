import { Routes } from '@angular/router';
import { AllBugsComponent } from './features/all-bugs/all-bugs.component';
import { DemoComponent } from './features/demo/demo.component';
import { NewBugComponent } from './features/new-bug/new-bug.component';
import { SearchSameBugsComponent } from './features/Identifying-recurring-bugs/search-same-bugs/search-same-bugs.component';
import { DashboardComponent } from './features/statistics/dashboard/dashboard.component';



export const routes: Routes = [
  { path: '', component: AllBugsComponent },
  { path: 'statistics', component: DashboardComponent },
  { path: 'addBug', component: NewBugComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'demo/:id', component: DemoComponent },
  { path: 'search-same-bugs', component: SearchSameBugsComponent },
];
