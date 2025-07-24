import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsBugDto, UserDto } from 'src/app/web-api-client';
import { CommentService } from 'src/app/services/Comment.service';
import { MentionModule } from 'angular-mentions';
import { StateService } from 'src/app/services/state.service';
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { MentionDisplayComponent } from "../demo/demoo/mention-display/mention-display.component";
import { MentionService } from 'src/app/services/Mention.Service';

@Component({
  selector: 'app-comment-panel',
  standalone: true,
  imports: [FormsModule, CommonModule, MentionModule, UserProfileComponent, MentionDisplayComponent],
  templateUrl: './comment-panel.component.html',
  styleUrl: './comment-panel.component.css'
})
export class CommentPanelComponent implements OnInit {
  @Input() comments: Array<CommentsBugDto> = [];
  @Input() bugId: number;
  @Input() isAuthorizedToComment: boolean = false;
  @Input() currentUserName: string = '';
  @Output() closePanel = new EventEmitter<void>();
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  adding = false;
  newComment: string = '';
  userList: UserDto[] = [];
  mentionUserIds = new Set<number>();
  filteredUsers: Array<UserDto> = [];
  showMentionList = false;
  caretPosition = 0;
  selectedUserIndex: number = 0;
  constructor(
    private stateService: StateService,
    private commentService: CommentService,
    private mentionService: MentionService
  ) { }


  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bugId'] && this.bugId) {
      this.loadComments();
    }
  }
  onTextChanged(value: string): void {
    this.newComment = value;
    this.caretPosition = this.commentInput?.nativeElement?.selectionStart || 0;
    const textUpToCaret = this.newComment.substring(0, this.caretPosition);
    const mentionMatch = /@([\w֐-׿]*)$/.exec(textUpToCaret);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      this.filteredUsers = this.userList.filter(user =>
        user.fullName.toLowerCase().includes(query)
      );
      this.showMentionList = this.filteredUsers.length > 0;
      this.selectedUserIndex = 0;
    } else {
      this.showMentionList = false;
    }
  }

  saveComment(): void {
    const trimmed = this.newComment.trim();
    if (!trimmed) return;

    const mentionedIds = this.mentionService.extractMentionedUserIds(this.newComment, this.userList);

    this.commentService.addComment(this.bugId, trimmed, mentionedIds).subscribe({
      next: () => {
        this.loadComments();
        this.newComment = '';
        this.adding = false;
      },
      error: (err) => console.error('שגיאה בהוספת תגובה', err)
    });
  }
  loadComments(): void {
    this.commentService.getCommentsByBugId(this.bugId).subscribe({
      next: (res) => this.comments = res,
      error: (err) => console.error('שגיאה בשליפת תגובות', err)
    });
  }

  loadUsers(): void {
    this.stateService.getAllUsers().subscribe({
      next: (users) => {
        this.userList = users;
        this.loadComments();
      },
      error: (err) => console.error('שגיאה בטעינת משתמשים:', err)
    });
  }
  deleteComment(id: number): void {
    this.commentService.deleteComment(id).subscribe(() => this.loadComments());
  }

  selectUser(user: UserDto): void {
    const textUpToCaret = this.newComment.substring(0, this.caretPosition);
    const textAfterCaret = this.newComment.substring(this.caretPosition);
    const mentionRegex = /@([\w֐-׿]*)$/;
    const match = mentionRegex.exec(textUpToCaret);
    if (!match) return;

    const mentionStartIndex = match.index;
    const beforeMention = this.newComment.slice(0, mentionStartIndex);
    const afterMention = textAfterCaret;

    this.newComment = `${beforeMention}@${user.fullName} ${afterMention}`.trim();
    this.caretPosition = (beforeMention + '@' + user.fullName + ' ').length;
    this.showMentionList = false;
    this.mentionUserIds.add(user.userId);
  }


  openAdd(): void {
    this.adding = true;
    setTimeout(() => {
      this.commentInput?.nativeElement?.focus();
    });
  }

  cancelAdd(): void {
    this.adding = false;
    this.newComment = '';
  }

  close(): void {
    this.closePanel.emit();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.showMentionList) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedUserIndex = (this.selectedUserIndex + 1) % this.filteredUsers.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedUserIndex = (this.selectedUserIndex - 1 + this.filteredUsers.length) % this.filteredUsers.length;
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const selectedUser = this.filteredUsers[this.selectedUserIndex];
        if (selectedUser) {
          this.selectUser(selectedUser);
        }
      } else if (event.key === 'Escape') {
        this.showMentionList = false;
      }
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveComment();
    }
  }

}
