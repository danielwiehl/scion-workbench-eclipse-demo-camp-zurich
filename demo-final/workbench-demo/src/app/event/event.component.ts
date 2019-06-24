import { Component } from '@angular/core';
import { WorkbenchView } from '@scion/workbench';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent {

  constructor(view: WorkbenchView, route: ActivatedRoute) {
    view.title = 'Event';
    view.heading = route.snapshot.paramMap.get('eventName');
  }
}
