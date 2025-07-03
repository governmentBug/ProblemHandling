import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone:true,
  imports: [RouterModule],
  
})
export class AppComponent {
  title = 'app';
}
