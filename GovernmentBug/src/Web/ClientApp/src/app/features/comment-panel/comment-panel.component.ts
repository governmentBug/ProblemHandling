import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsBugDto, UserDto } from 'src/app/web-api-client';
import { CommentService } from 'src/app/services/Comment.service';
import { MentionModule } from 'angular-mentions';
import { StateService } from 'src/app/services/state.service';
import { UserProfileComponent } from "../user-profile/user-profile.component";
@Component({
  selector: 'app-comment-panel',
  standalone: true,
  imports: [FormsModule, CommonModule, MentionModule, UserProfileComponent],
  templateUrl: './comment-panel.component.html',
  styleUrl: './comment-panel.component.css'
})
export class CommentPanelComponent implements OnInit {
  @Input() comments: Array<CommentsBugDto>
  @Input() bugId: number
  @Input() isAuthorizedToComment: boolean = false;
  @Input() currentUserName: string = '';
  @Output() closePanel = new EventEmitter<void>();
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  adding = false;
  newComment: string = '';
  userList: Array<UserDto> = []
  mentionUserIds = new Set<Number>
  filteredUsers:  Array<UserDto> = []
  mentions:  Array<UserDto> = []

  showMentionList = false;
  caretPosition = 0;

  onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement
    this.newComment = textarea.value
    this.caretPosition = textarea.selectionStart || 0
    const textUpToCaret = this.newComment.substring(0, this.caretPosition);
    const match = /@([\w\u0590-\u05FF]*)$/.exec(textUpToCaret);

    if (match) {
      const query = match[1];
      this.filteredUsers = this.userList.filter(user =>
        user.fullName.toLowerCase().includes(query.toLowerCase())
      );
      this.showMentionList = this.filteredUsers.length > 0;
    } 
    else {
      this.showMentionList = false;
    }
  }

  selectUser(user:UserDto) {
    const textUpToCaret = this.newComment.substring(0, this.caretPosition);
    const textAfterCaret = this.newComment.substring(this.caretPosition);

    // חפש את המילה שמתחילה ב־@ אחרונה
    const mentionRegex = /@([\w\u0590-\u05FF]*)$/;
    const match = mentionRegex.exec(textUpToCaret);

    if (!match) return;

    const mentionStartIndex = match.index;
    const beforeMention = this.newComment.slice(0, mentionStartIndex);
    const afterMention = textAfterCaret;

    // החלפת המילה המתוייגת במשתמש שנבחר
    this.newComment = `${beforeMention}@${user.fullName} ${afterMention}`.trim();
    this.caretPosition = (beforeMention + '@' + user.fullName + ' ').length;
    this.showMentionList = false;

    if (!this.mentions.some(u => u.userId === user.userId)) {
      this.mentions.push(user);
    }
  }

  constructor(private stateService: StateService, private CommentService: CommentService) { }
  ngOnInit(): void {
    this.loadComments()
    this.loadUsers()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditMode'] && this.bugId)
      this.loadComments()
    if (changes['bugId'] && this.bugId) {
      this.loadComments();
    }
  }
  onMentionSelect(user: any) {
    this.mentionUserIds.add(user.id)
    console.log(user);

  }
  loadComments(): void {
    this.CommentService.getCommentsByBugId(this.bugId).subscribe({
      next: (res) => {
        this.comments = res
        console.log(res);

      },
      error: (err) => console.error('שגיאה בשליפת תגובות', err)
    });
  } loadUsers(): void {
    this.stateService.getAllUsers().subscribe({
      next: (users) => {
        this.userList = users;
        console.log('משתמשים נטענו:', this.userList);
      },
      error: (err) => {
        console.error('שגיאה בטעינת משתמשים:', err);
      }
    });
  } saveComment() {
    const trimmed = this.newComment.trim();
    if (trimmed) {
      this.CommentService.addComment(this.bugId, trimmed).subscribe({
        next: () => {
          this.loadComments()
          this.newComment = '';
          this.adding = false;
          console.log(this.mentionUserIds);
        },
        error: (err) => console.error('שגיאה בהוספת תגובה', err)
      });
    }
  }
  deleteComment(id: number) {
    this.CommentService.deleteComment(id).subscribe(() => {
      this.loadComments();
    })
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

  close() {
    this.closePanel.emit();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  handleEnter(event) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.saveComment();
    }
  }

}
