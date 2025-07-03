import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBugsComponent } from './all-bugs.component';

const routes: Routes = [
  { path: 'all-bugs/', component: AllBugsComponent }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllBugsRoutingModule { }
