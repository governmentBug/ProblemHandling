import { Component, Input } from '@angular/core';
import { UserDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrls:[ './user-profile.component.css']
})
export class UserProfileComponent {
@Input() user: UserDto;

}
