import { Component, OnInit, OnDestroy   } from '@angular/core';
import { RsvpService } from './rsvp.service';
import { Attendees } from './attendees';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnDestroy{
  title = 'app';
  model = new Attendees('', '1');  
  attendeesResult: any;
  private subscription: ISubscription;

  constructor (private rsvpService: RsvpService){
    // constructor.
  }

  ngOnInit() {
    // page load init
    this.model = new Attendees('', '1');
    this.subscription = this.rsvpService.getAllRsvps()
    .subscribe(result => {
      this.attendeesResult = result;
    });
  }

  onSubmit(){
    console.log("save rsvp...");
    console.log("rsvp name..."  + this.model.name);
    console.log("rsvp status..." + this.model.status);
    
    this.rsvpService.saveRsvp(this.model)
    .subscribe(result => {
      console.log(result);
      this.subscription = this.rsvpService.getAllRsvps()
      .subscribe(result => {
        this.attendeesResult = result;
      });
    });
  }

  ngOnDestroy() {
    console.log("destroy ....");
    this.subscription.unsubscribe();
  }
}
