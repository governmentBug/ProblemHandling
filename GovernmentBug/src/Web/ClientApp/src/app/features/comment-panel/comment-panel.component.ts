import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsBugDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-comment-panel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comment-panel.component.html',
  styleUrl: './comment-panel.component.css'
})
export class CommentPanelComponent {
  @Input() comments: CommentsBugDto[] = [];
  @Input() isAuthorizedToComment: boolean = false;
  @Input() currentUserName: string = '';
  @Output() commentAdded = new EventEmitter<string>();
  @Output() commentDeleted = new EventEmitter<number>();
  @Output() closePanel = new EventEmitter<void>();
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  adding = false;
  newComment: string = '';
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  openAdd() {
    this.adding = true;
      setTimeout(() => {
      this.commentInput?.nativeElement?.focus();
  });
  }

  cancelAdd() {
    this.adding = false;
    this.newComment = '';
  }

  saveComment() {
    const trimmed = this.newComment.trim();
    if (trimmed) {
      this.commentAdded.emit(trimmed);
      this.newComment = '';
      this.adding = false;
    }
  }

  deleteComment(id: number) {
    this.commentDeleted.emit(id);
  }

  close() {
    this.closePanel.emit();
  }
  handleEnter(event) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.saveComment();
    }
  }

}
