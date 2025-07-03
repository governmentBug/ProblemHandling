import { Component,Input } from '@angular/core';
import { Bug } from '../../models/bug.model';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-bug-detail',
    standalone:true,
    imports: [CommonModule],
    templateUrl: './bug-detail.component.html',
    styleUrl: './bug-detail.component.css'
})
export class BugDetailComponent {
  @Input() bug!: Bug;
}
