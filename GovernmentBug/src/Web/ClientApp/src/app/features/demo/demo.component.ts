
  import { Component } from '@angular/core';
import { TextEditorComponent } from '../text-editore/text-editore.component';
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ TextEditorComponent],
  template: `
    <h2>דמו תיוג עם זיהוי משתמשים קיימים</h2>
    <app-text-editor />
  `
})
export class DemoComponent {}

