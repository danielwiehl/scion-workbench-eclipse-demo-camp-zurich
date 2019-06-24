import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map, mergeMapTo, take, tap } from 'rxjs/operators';
import { EMPTY, MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import { SessionStorageService } from './session-storage.service';
import { WorkbenchRouter } from '@scion/workbench-application.angular';
import { Contact } from './contact.model';

const PERSONS_STORAGE_KEY = 'contact.data';

@Injectable({providedIn: 'root'})
export class ContactService {

  private _contactDictionary$: Observable<ContactDictionary>;
  public contacts$: Observable<Contact[]>;

  constructor(httpClient: HttpClient, private _storage: SessionStorageService, private _router: WorkbenchRouter) {
    this._contactDictionary$ = this._storage.observe$(PERSONS_STORAGE_KEY, () => {
      return httpClient.get<Contact[]>('assets/contact.data.json').pipe(mapToContactDictionary());
    });
    this.contacts$ = this._contactDictionary$.pipe(mapToContactArray())
  }

  public contact$(id: string): Observable<Contact> {
    return this._contactDictionary$
      .pipe(
        map(dictionary => dictionary[id]),
        filter(Boolean),
      );
  }

  public update$(contact: Contact): Observable<never> {
    return this._contactDictionary$
      .pipe(
        take(1),
        putContact(this._storage, contact),
        mergeMapTo(EMPTY),
      );
  }
}

interface ContactDictionary {
  [key: string]: any;
}

function mapToContactDictionary(): OperatorFunction<Contact[], ContactDictionary> {
  return map((contacts: Contact[]): ContactDictionary => {
    return contacts.reduce((acc, contact) => ({...acc, ...{[contact.id]: contact}}), {});
  });
}

function mapToContactArray(): OperatorFunction<ContactDictionary, Contact[]> {
  return map((dictionary: ContactDictionary): Contact[] => {
    return Object.keys(dictionary)
      .map(id => dictionary[id])
      .filter(Boolean)
      .reduce((acc, contact) => [...acc, contact], [] as Contact[])
      .sort((p1, p2) => p1.firstname.localeCompare(p2.firstname));
  });
}

function putContact(storage: SessionStorageService, contact: Contact): MonoTypeOperatorFunction<ContactDictionary> {
  return tap((dictionary: ContactDictionary): void => {
    dictionary[contact.id] = contact;
    storage.put(PERSONS_STORAGE_KEY, dictionary);
  });
}
