import { Component, OnInit } from '@angular/core';
import { CountdownTimerService } from '../services/countdown-timer.service';
import { CountdownTimer } from '../interfaces/countdown-timer';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  countdownTimers: CountdownTimer[];

  constructor(private countdownTimerService: CountdownTimerService) { }

  ngOnInit() {
    this.getTimers();
  }

  getTimers() {
    this.countdownTimerService.getTimers().subscribe(
      (result: CountdownTimer[]) => {
        this.countdownTimers = result;
      },
      (error: any) => {
        console.log('Error subscribing to countdownTimers in AboutComponent: ', error);
      }
    );
  }

}
