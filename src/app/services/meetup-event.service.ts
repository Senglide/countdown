import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MeetupEventService {

  apiString: string;
  apiKey: string;
  corsProxy: string;
  location: string;

  meetupEvents$: Observable<any>;

  constructor(private http: HttpClient) { 
    this.apiKey = '35113913465f5948c475566731635';
    this.corsProxy = 'https://shielded-reef-66161.herokuapp.com/';
    this.apiString = this.corsProxy + 'https://api.meetup.com/find/upcoming_events?key=' + this.apiKey + '&end_date_range=2020-01-05T00:00:00&sign=true';
  }

  getMeetupEvents() {
    return this.http.get(this.apiString);
  }


}
