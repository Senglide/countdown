import { Component, OnInit } from '@angular/core';
import { CountdownTimerService } from '../services/countdown-timer.service';
import { CountdownTimer } from '../interfaces/countdown-timer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  publicTimers: CountdownTimer[];
  mostPopularTimers: CountdownTimer[];

  constructor(private countdownTimerService: CountdownTimerService) { }

  ngOnInit() {
    this.getTimers();
  }

  getTimers() {
    this.countdownTimerService.getPublicTimers().subscribe(
      (result: CountdownTimer[]) => {
        const timers_temp = result;
        this.fixTimers(timers_temp);
        this.sortTimers();
        this.count_down();
      },
      (error: any) => {
        console.log('Error subscribing to public timers in HomeComponent: ', error);
      }
    );
  }

  fixTimers(timers: CountdownTimer[]) {
    this.publicTimers = new Array();
    timers.forEach((countDownTimer) => {
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
      this.publicTimers.push(timer);
    });
  }

  sortTimers() {
    this.mostPopularTimers = this.publicTimers.slice();
    this.mostPopularTimers.sort((a, b) => { return (b.subscriptions - a.subscriptions); });
  }

  count_down() {
    while(new Date().getMilliseconds() != 0) {}
    const homeContext = this;
    const interval = 1000;
    var expected = Date.now() + interval;
    setTimeout(tick, interval);
    function tick() {
      homeContext.publicTimers.forEach((countDownTimer) => {
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

}
