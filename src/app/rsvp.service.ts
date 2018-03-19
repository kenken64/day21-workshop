import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import {Observable} from 'rxjs/Observable';
import { Attendees } from './attendees';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}


@Injectable()
export class RsvpService {
  private apiURL: string = 'http://localhost:3000/rsvp';

  constructor(private httpClient: HttpClient) {

  }

  public getAllRsvps(){
    return this.httpClient.get<Attendees[]>(this.apiURL);
  }

  public saveRsvp(attendees: Attendees){
    return this.httpClient.post(this.apiURL, attendees, httpOptions);
  }
}
