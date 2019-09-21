import { Component, OnInit, Input } from '@angular/core';
import { CountdownTimer } from '../interfaces/countdown-timer';
import { CountdownTimerService } from '../services/countdown-timer.service';
import { NgbActiveModal, NgbDateStruct, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoService } from '../services/user-info.service';
import { UserInfo } from '../interfaces/user-info';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {
  
  @Input() countdownTimer: CountdownTimer;
  @Input() globalHome: boolean;
  
  isSubscription: boolean;
  ownedByLoggedUser: boolean;
  activeModal: NgbActiveModal;
  date: NgbDateStruct;
  time: {
    hour: number,
    minute: number,
  };
  timerUserInfo: UserInfo;
  loggedUserInfo: UserInfo;
  buttonsEnabled = true;

  constructor(private countdownTimerService: CountdownTimerService, private modal: NgbModal, private calendar: NgbCalendar, private userInfoService: UserInfoService) { }

  ngOnInit() { 
    this.createDateTimeModel();
    this.userInfoService.getUserInfo(this.countdownTimer.userId).subscribe(timerUserInfo => this.timerUserInfo = timerUserInfo);
    if(this.countdownTimerService.user) {
      this.userInfoService.getUserInfo(this.countdownTimerService.user.uid).subscribe(
        (result: UserInfo) => {
          this.loggedUserInfo = result;
          if(this.loggedUserInfo) {
            this.setBoolValues();
          }
        },
        (error: any) => {
          console.log('Error subscribing to userInfo in CountdownTimerComponent: ', error);
        }
      );
    }
  }

  setBoolValues() {
    if(this.loggedUserInfo.subscriptions && this.loggedUserInfo.subscriptions.includes(this.countdownTimer.id)) {
      this.isSubscription = true;
    } else {
      this.isSubscription = false;
    }
    if(this.countdownTimer.userId == this.loggedUserInfo.id) {
      this.ownedByLoggedUser = true;
    } else {
      this.ownedByLoggedUser = false;
    }
    this.buttonsEnabled = true;
  }

  deleteTimer() {
    this.buttonsEnabled = false;
    this.countdownTimerService.deleteTimer(this.countdownTimer.id);
  }

  openModal(content) {
    this.activeModal = this.modal.open(content);
  }

  closeEditModal(name: string, description: string) {
    this.countdownTimer.name = name;
    this.countdownTimer.endDate = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute, 0, new Date().getMilliseconds());
    this.countdownTimer.description = description;
    this.countdownTimerService.updateTimer(this.countdownTimer);
    this.activeModal.close();
  }

  closeEditModalWithoutSaving() {
    this.activeModal.close();
  }

  closeSubscriptionModal(decision: string) {
    if(decision == 'yes') {
      this.confirmSubscription();
      this.buttonsEnabled = false;
    }
    this.activeModal.close();
  }

  closeUnsubscribeModal(decision: string) {
    if(decision == 'yes') {
      this.deleteSubscription();
      this.buttonsEnabled = false;
    }
    this.activeModal.close();
  }

  toggleChecked() {
    this.countdownTimer.isPublic = !this.countdownTimer.isPublic;
  }

  createDateTimeModel() {
    this.date = {
      day: this.countdownTimer.endDate.getDate(),
      month: this.countdownTimer.endDate.getMonth() + 1,
      year: this.countdownTimer.endDate.getFullYear() 
    };
    this.time = {
      hour: this.countdownTimer.endDate.getHours(),
      minute: this.countdownTimer.endDate.getMinutes()
    };
  }

  formatTimer() {
    if(this.countdownTimer.timeRemaining.seconds != 1) {
      var timerString = this.countdownTimer.timeRemaining.seconds + ' seconds remaining';
    } else {
      var timerString = this.countdownTimer.timeRemaining.seconds + ' second remaining';
    }
    if(this.countdownTimer.timeRemaining.minutes != 0 || this.countdownTimer.timeRemaining.hours != 0) {
      if(this.countdownTimer.timeRemaining.minutes != 1) {
        timerString = this.countdownTimer.timeRemaining.minutes + ' minutes and ' + timerString;
      } else {
        timerString = this.countdownTimer.timeRemaining.minutes + ' minute and ' + timerString;
      }
    }
    if(this.countdownTimer.timeRemaining.hours != 0 || this.countdownTimer.timeRemaining.days != 0) {
      if(this.countdownTimer.timeRemaining.hours != 1) {
        timerString = this.countdownTimer.timeRemaining.hours + ' hours, ' + timerString;
      } else {
        timerString = this.countdownTimer.timeRemaining.hours + ' hour, ' + timerString;
      }
    }
    if(this.countdownTimer.timeRemaining.days != 0 || this.countdownTimer.timeRemaining.months != 0) {
      if(this.countdownTimer.timeRemaining.days != 1) {
        timerString = this.countdownTimer.timeRemaining.days + ' days, ' + timerString;
      } else {
        timerString = this.countdownTimer.timeRemaining.days + ' day, ' + timerString;
      }
    }
    if(this.countdownTimer.timeRemaining.months != 0 || this.countdownTimer.timeRemaining.years != 0) {
      if(this.countdownTimer.timeRemaining.months != 1) {
        timerString = this.countdownTimer.timeRemaining.months + ' months, ' + timerString;
      } else {
        timerString = this.countdownTimer.timeRemaining.months + ' month, ' + timerString;
      }
    }
    if(this.countdownTimer.timeRemaining.years != 0) {
      if(this.countdownTimer.timeRemaining.years != 1) {
        timerString = this.countdownTimer.timeRemaining.years + ' years, ' + timerString;
      } else {
        timerString = this.countdownTimer.timeRemaining.years + ' year, ' + timerString;
      }
    }
    return timerString;
  }

  formatDateTime() {
    var dateTime = '';
    if(this.date.day.toString().length == 1) {
      dateTime += 0;
    }
    dateTime += this.date.day + "/";
    if(this.date.month.toString().length == 1) {
      dateTime += 0;
    }
    dateTime += this.date.month + "/" + this.date.year + " - ";
    if(this.time.hour.toString().length == 1) {
      dateTime += 0;
    }
    dateTime += this.time.hour + ":";
    if(this.time.minute.toString().length == 1) {
      dateTime += 0;
    }
    return dateTime += this.time.minute;
  }

  formatIsPublic() {
    if(this.countdownTimer.isPublic) {
      var publicString = 'Public: ' + this.countdownTimer.subscriptions + ' subscription';
      if(this.countdownTimer.subscriptions !== 1) {
        publicString +='s';
      }
      return publicString;
    }
    return 'This timer is private';
  }

  formatCategories() {
    var categoryString = 'Categories: ';
    if(this.countdownTimer.categories.length == 0) {
      return 'No categories provided';
    }
    if(this.countdownTimer.categories.length == 1) {
      return 'Category: ' + this.countdownTimer.categories[0];
    }
    this.countdownTimer.categories.forEach(category => {
      if(category == this.countdownTimer.categories[this.countdownTimer.categories.length - 1]){
        categoryString += category;
      } else {
        categoryString += category + ', ';
      }
    });
    return categoryString;
  }

  formatDescription() {
    if(this.countdownTimer.description == '') {
      return 'No description provided';
    }
    return this.countdownTimer.description;
  }

  formatTimerCreator() {
    if(this.timerUserInfo && (this.globalHome || this.isSubscription)) {
      return 'Timer by ' + this.timerUserInfo.alias;
    }
  }

  confirmSubscription() {
    if(this.loggedUserInfo.subscriptions != undefined) {
      this.loggedUserInfo.subscriptions[this.loggedUserInfo.subscriptions.length] = this.countdownTimer.id;
    } else {
      this.loggedUserInfo.subscriptions = new Array();
      this.loggedUserInfo.subscriptions.push(this.countdownTimer.id);
    }
    this.countdownTimer.subscriptions ++;
    this.countdownTimerService.updateTimer(this.countdownTimer);
    this.userInfoService.updateUserInfo(this.loggedUserInfo);
  }

  deleteSubscription() {
    this.countdownTimer.subscriptions --;
    this.loggedUserInfo.subscriptions.splice(this.loggedUserInfo.subscriptions.indexOf(this.countdownTimer.id), 1);
    this.countdownTimerService.updateTimer(this.countdownTimer);
    this.userInfoService.updateUserInfo(this.loggedUserInfo);
  }

  updateCategories(category: string) {
    if(this.countdownTimer.categories.includes(category)){
      this.countdownTimer.categories.splice(this.countdownTimer.categories.indexOf(category), 1);
    } else {
      this.countdownTimer.categories.push(category);
    }
  }

  checkChecked(category: string) {
    if(this.countdownTimer.categories.includes(category)){
      return true;
    }
    return false;
  }
  
}
