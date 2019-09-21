import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { UserInfo } from '../interfaces/user-info';
import { UserInfoService } from '../services/user-info.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;
  user: User;
  userInfo: UserInfo;

  constructor(public authService: AuthService, private userInfoService: UserInfoService) { }

  ngOnInit() {
    this.authService.userData$.subscribe( 
      data => {
        this.user = data;
        if(this.user) {
          this.userInfoService.getUserInfo(this.user.uid).subscribe(result => this.userInfo = result)
        }
      });
  }

}
