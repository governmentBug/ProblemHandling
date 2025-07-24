
  import { Component } from '@angular/core';
import { MentionInputComponent } from './demoo/mention-input/mention-input.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [MentionInputComponent],
  template: `
    <h2>דמו תיוג עם זיהוי משתמשים קיימים</h2>
    <app-mention-input />
  `
})
export class DemoComponent {}

