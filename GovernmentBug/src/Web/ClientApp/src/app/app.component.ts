import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AllBugsComponent } from "./features/all-bugs/all-bugs.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone:true,
  imports: [RouterModule],
  
})
export class AppComponent {
  title = 'app';
}
