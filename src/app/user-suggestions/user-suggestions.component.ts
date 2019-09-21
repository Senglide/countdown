import { Component, OnInit } from '@angular/core';
import { MeetupEventService } from 'src/app/services/meetup-event.service';
import { MeetupEvent } from 'src/app/interfaces/meetup-event';

@Component({
  selector: 'app-user-suggestions',
  templateUrl: './user-suggestions.component.html',
  styleUrls: ['./user-suggestions.component.scss']
})
export class UserSuggestionsComponent implements OnInit {

  location: string;
  meetupEvents: MeetupEvent[];

  constructor(private meetupEventService: MeetupEventService) { }

  ngOnInit() {
    this.meetupEventService.getMeetupEvents().subscribe(
      result => { 
        this.location = result['city'].city;
        this.meetupEvents = new Array();
        for(let i in result['events']) {
          let meetupEvent = new MeetupEvent();
          meetupEvent.date = result['events'][i].local_date + ', ' + result['events'][i].local_time;
          meetupEvent.link = result['events'][i].link;
          meetupEvent.name = result['events'][i].name;
          meetupEvent.description = result['events'][i].description;
          this.meetupEvents[this.meetupEvents.length] = meetupEvent;
        }
      },
      error => { 
        console.log('Error fetching meetupEvents in UserSuggestionsComponent: ' + error);
      }
    );
  }

}
