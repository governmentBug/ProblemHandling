import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserDto } from '../web-api-client';

@Injectable({ providedIn: 'root' })
export class MentionService {
  
  getMentionsFromText(text: string, users: UserDto[]) {
  const mentionRegex = /@([\u0590-\u05FFa-zA-Z\-']+(?:\s[\u0590-\u05FFa-zA-Z\-']+)*)/g;
  const parts: { text: string; isMention: boolean; user?: UserDto }[] = [];
  let lastIndex = 0;

  text.replace(mentionRegex, (match, mention, offset) => {
    if (lastIndex < offset) {
      parts.push({ text: text.slice(lastIndex, offset), isMention: false });
    }
    const fullName = mention.trim();
    const matchedUser = users.find(
      u => u.fullName.toLowerCase() === fullName.toLowerCase()
    );

    parts.push({ 
      text: match, // כולל הסימן @
      isMention: !!matchedUser,
      user: matchedUser 
    });

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isMention: false });
  }

  return parts;
}


  extractMentionedUserIds(text: string, users: UserDto[]): number[] {
    const mentions = this.getMentionsFromText(text, users);
    const mentionedNames = mentions.filter(p => p.isMention).map(p => p.text.toLowerCase());

    return users
      .filter(u => mentionedNames.includes(u.fullName.toLowerCase()))
      .map(u => u.userId);
  }
}
