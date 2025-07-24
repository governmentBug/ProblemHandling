import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDto } from 'src/app/web-api-client';
import { MentionService } from 'src/app/services/Mention.Service';
import { UserProfileComponent } from 'src/app/features/user-profile/user-profile.component';

@Component({
  selector: 'app-mention-display',
  standalone: true,
  imports: [CommonModule, UserProfileComponent],
  templateUrl: './mention-display.component.html',
  styleUrls: ['./mention-display.component.css']
})
export class MentionDisplayComponent {
  @Input() text: string = '';
  @Input() users: UserDto[] = [];

  hoveredUser: UserDto | null = null;
  hoverTimeout: any;
  popupX = 0;
  popupY = 0;

  constructor(private mentionService: MentionService) {}

  get parsedParts() {
    return this.mentionService.getMentionsFromText(this.text, this.users);
  }

  startHover(user: UserDto, event: MouseEvent) {
    clearTimeout(this.hoverTimeout);
    this.hoveredUser = user;
    this.popupX = event.clientX ;
    this.popupY = event.clientY;
  }

  endHover() {
    this.hoverTimeout = setTimeout(() => {
      this.hoveredUser = null;
    }, 100);
  }
  clearHoverTimeout() {
  clearTimeout(this.hoverTimeout);
}

}
