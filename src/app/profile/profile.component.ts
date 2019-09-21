import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { UserInfoService } from '../services/user-info.service';
import { UserInfo } from '../interfaces/user-info';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  userInfo: UserInfo;

  constructor(private authService: AuthService, private userInfoService: UserInfoService) { 
    this.authService.userData$.subscribe(
      (result: User) => {
        this.user = result;
        if(this.user) {
          this.userInfoService.getUserInfo(this.user.uid).subscribe(data => this.userInfo = data);
        }
      },
      (error: any) => {
        console.log('Error fetching user in CountdownTimerService: ' + error);
      }
    );
  }

  ngOnInit() {
  }

  updateProfile(displayName: string) {
    this.user.displayName = displayName;
    this.authService.editUserInfo(this.user);
  }

}
