import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CountdownTimer } from '../interfaces/countdown-timer';
import { CountdownTimerService } from '../services/countdown-timer.service';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';
import { UserInfo } from '../interfaces/user-info';
import { UserInfoService } from '../services/user-info.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styles: []
})
export class UserHomeComponent implements OnInit {
  
  user: User;
  userInfo: UserInfo;
  activeModal: NgbActiveModal;
  activeModal2: NgbActiveModal;
  date: NgbDateStruct;
  time: {
    hour: number,
    minute: number,
  };
  timers: CountdownTimer[];
  isPublic = false;
  categories: string[];
  errorMessage: string;

  constructor(private countdownTimerService: CountdownTimerService, private modal: NgbModal, private calendar: NgbCalendar, private authService: AuthService, private userInfoService: UserInfoService) { }

  ngOnInit() {
    this.getUser();
    this.time = {
      hour: 0,
      minute: 0
    };
  }

  getUser() {
    this.authService.userData$.subscribe(
      (result: User) => {
        this.user = result;
        if(this.user != null) {
          this.getUserInfo();
        }
      },
      (error: any) => {
        console.log('Error fetching user in UserHomeComponent: ' + error);
      }
    );
  }

  getUserInfo() {
    this.userInfoService.getUserInfo(this.user.uid).subscribe(
      (result: UserInfo) => {
        this.userInfo = result;
        if(this.userInfo != null) {
          this.getTimers();
        }
      },
      (error: any) => {
        console.log('Error fetching userInfo in UserHomeComponent: ' + error);
      }
    );
  }

  getTimers() {
    this.countdownTimerService.getTimers().subscribe(
      (result: CountdownTimer[]) => {
        const timers_temp = result;
        this.fixTimers(timers_temp);
        this.count_down();
      },
      (error: any) => {
        console.log('Error subscribing to userTimers$ in UserHomeComponent: ', error);
      }
    );
  }

  fixTimers(timers: CountdownTimer[]) {
    this.timers = new Array();
    timers.forEach((countDownTimer) => {
      if(countDownTimer.userId == this.user.uid || (this.userInfo.subscriptions != undefined && this.userInfo.subscriptions.includes(countDownTimer.id))) {
        const timer = new CountdownTimer(
          new Date(countDownTimer.endDate),
          countDownTimer.isPublic,
          countDownTimer.name
        );
        timer.endDate.setMilliseconds(new Date().getMilliseconds());
        timer.id = countDownTimer.id;
        timer.userId = countDownTimer.userId;
        timer.subscriptions = countDownTimer.subscriptions;
        timer.subscribers = countDownTimer.subscribers;
        timer.description = countDownTimer.description;
        timer.categories = countDownTimer.categories;
        this.timers.push(timer);
      }
    });
  }

  newCountdownModal(content) {
    this.getNow();
    this.activeModal = this.modal.open(content);
  }

  saveCountdownModal(name: string, description: string, errorModal) {
    if(name != '') {
      this.newDate(name, description, errorModal);
    } else {
      this.toggleActiveModal(false);
      this.errorMessage = 'Please provide a name for the timer';
      this.activeModal2 = this.modal.open(errorModal);
    }
  }

  closeCountdownModal() {
    this.activeModal.close();
  }

  closeErrorModal() {
    this.activeModal2.close();
    this.toggleActiveModal(true);
  }

  toggleActiveModal(makeVisible: boolean) {
    let elem: HTMLElement = document.getElementById('newTimerModal').parentElement.parentElement.parentElement;
    if(makeVisible) {
      elem.setAttribute("style", "visibility: visible;");
    } else {
      elem.setAttribute("style", "visibility: hidden;");
    }
  }

  toggleChecked() {
    this.isPublic = !this.isPublic;
  }

  newDate(name: string, description: string, modal) {
    let countdownTimer = new CountdownTimer(
      new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute, 0, new Date().getMilliseconds()),
      this.isPublic,
      name
    );
    if(countdownTimer.endDate <= new Date()) {
      this.toggleActiveModal(false);
      this.errorMessage = 'Please provide a date that lies in the future';
      this.activeModal2 = this.modal.open(modal);
    } else {
      countdownTimer.description = description;
      if(this.categories == undefined) {
        countdownTimer.categories = new Array();
      } else {
        countdownTimer.categories = this.categories;
      }
      this.countdownTimerService.addTimer(countdownTimer);
      this.isPublic = false;
      this.activeModal.close();
    } 
  }

  count_down() {
    while(new Date().getMilliseconds() != 0) {}
    const homeContext = this;
    const interval = 1000;
    var expected = Date.now() + interval;
    setTimeout(tick, interval);
    function tick() {
      homeContext.timers.forEach((countDownTimer) => {
        countDownTimer.update();
        if(countDownTimer.timeRemaining.total <= 0) {
          homeContext.countdownTimerService.deleteTimer(countDownTimer.id);
        }
      });
      const delta = Date.now() - expected;
      expected += interval;
      setTimeout(tick, Math.max(0, interval - delta));
    }
  }

  getNow() {
    this.date = this.calendar.getToday();
    this.time.hour = new Date().getHours();
    this.time.minute = new Date().getMinutes();
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

  updateCategories(category: string) {
    if(!this.categories) {
      this.categories = new Array();
    }
    if(this.categories.includes(category)){
      this.categories.splice(this.categories.indexOf(category), 1);
    } else {
      this.categories.push(category);
    }
  }

}
