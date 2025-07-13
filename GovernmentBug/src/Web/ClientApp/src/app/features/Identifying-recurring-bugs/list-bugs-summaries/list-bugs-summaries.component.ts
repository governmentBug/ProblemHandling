import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugSummariesDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-list-bugs-summaries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-bugs-summaries.component.html',
  styleUrl: './list-bugs-summaries.component.css'
})
export class ListBugsSummariesComponent {
  @Input() bugsSummaries: BugSummariesDto[] = [];
  @Output() viewBug = new EventEmitter<number>();

  onViewBug(id: number) {
    this.viewBug.emit(id);
  }
}
