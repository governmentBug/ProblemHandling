import { Component, Input, OnInit } from '@angular/core';
import { ByStatus } from 'src/app/models/byStatus.model';

@Component({
  selector: 'app-by-status',
  standalone: true,
  imports: [],
  templateUrl: './by-status.component.html',
  styleUrl: './by-status.component.css'
})
export class ByStatusComponent{
  @Input() byStatus: ByStatus;
}
