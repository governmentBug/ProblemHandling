import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserDto } from '../web-api-client';

@Injectable({ providedIn: 'root' })
export class MentionService {
  constructor(private sanitizer: DomSanitizer) {}

  processTextWithMentions(text: string, mentionedUsers: Array<UserDto>): SafeHtml {
    let html = text;
    mentionedUsers.forEach(user => {
      const escapedName = this.escapeRegExp(user.fullName);
      const mentionText = new RegExp(`@${escapedName}\\b`, 'g'); 
      const mentionHtml = `<span class="mention" title="${user.email || ''}" data-user-id="${user.userId}">@${user.fullName}</span>`;
      html = html.replace(mentionText, mentionHtml);
    });
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
