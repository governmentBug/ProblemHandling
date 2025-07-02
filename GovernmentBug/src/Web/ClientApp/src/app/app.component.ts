import { Component } from '@angular/core';
import { DemoComponent } from "./features/demo/demo.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone:true,
  imports: [DemoComponent]
})
export class AppComponent {
  title = 'app';
}
