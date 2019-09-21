import { Component, OnInit, Input } from '@angular/core';
import { MeetupEvent } from 'src/app/interfaces/meetup-event';
import { NgbDateStruct, NgbActiveModal, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CountdownTimerService } from 'src/app/services/countdown-timer.service';
import { CountdownTimer } from 'src/app/interfaces/countdown-timer';
import { UserHomeComponent } from 'src/app/user-home/user-home.component';

@Component({
  selector: 'app-user-suggestion',
  templateUrl: './user-suggestion.component.html',
  styleUrls: ['./user-suggestion.component.scss']
})
export class UserSuggestionComponent implements OnInit {

  @Input() meetupEvent: MeetupEvent;

  activeModal: NgbActiveModal;
  activeModal2: NgbActiveModal;
  date: NgbDateStruct;
  time: {
    hour: number,
    minute: number,
  };
  isPublic = false;
  categories: string[];
  errorMessage: string;
  convertedDate: Date;
  privateTimers: CountdownTimer[];
  exists = false;

  constructor(private countdownTimerService: CountdownTimerService, private modal: NgbModal, private calendar: NgbCalendar) { }

  ngOnInit() { 
    this.convertedDate = new Date(this.meetupEvent.date);
    this.time = {
      hour: 0,
      minute: 0
    };
    this.getPrivateTimers();
  }

  getPrivateTimers() {
    this.countdownTimerService.getPrivateTimers().subscribe(
      (result: CountdownTimer[]) => {
        this.privateTimers = result;
        this.checkIfExists();
      },
      (error: any) => {
        console.log('Error subscribing to private timers in UserSuggestionComponent: ', error);
      }
    );
  }

  checkIfExists() {
    this.privateTimers.forEach((countDownTimer) => {
      if(countDownTimer.name == this.meetupEvent.name) {
        let elem = <HTMLInputElement> document.getElementById("addButton");
        elem.disabled = true;
      }
    });
  }

  newCountdownModal(content) {
    this.getEventDateTime();
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

  getEventDateTime() {
    this.date = {day: this.convertedDate.getDate(), month: (this.convertedDate.getMonth() + 1), year: this.convertedDate.getFullYear()};
    this.time.hour = this.convertedDate.getHours();
    this.time.minute = this.convertedDate.getMinutes();
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
