import { Component, OnDestroy } from '@angular/core';
import { PopupService, provideWorkbenchView, WorkbenchView } from '@scion/workbench-application.angular';
import { Subject } from 'rxjs';
import { Contact } from '../contact.model';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../contact.service';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [provideWorkbenchView(ContactComponent)],
})
export class ContactComponent implements OnDestroy {

  private destroy$ = new Subject<void>();
  public contact: Contact;

  constructor(route: ActivatedRoute,
              private contactService: ContactService,
              private _popupService: PopupService,
              view: WorkbenchView) {
    route.params
      .pipe(
        switchMap(params => this.contactService.contact$(params['id'])),
        takeUntil(this.destroy$),
      )
      .subscribe(contact => {
        this.contact = contact;
        view.title = contact.firstname + ' ' + contact.lastname;
      });
  }

  public onCommunicationAdd(event: MouseEvent): void {
    event.preventDefault();

    this._popupService.open({position: 'east', anchor: event.target as Element}, {
      entity: 'communication',
      action: 'create',
      contactId: this.contact.id,
    });
  }

  public onSave(): void {
    this.contactService.update$(this.contact).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }
}
