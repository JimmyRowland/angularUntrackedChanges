import { Injectable } from '@angular/core';
import { ReplaySubject, switchMap } from 'rxjs';
import { fetchEntries } from './utils/fetch';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {
  reload = new ReplaySubject<void>();
  entries = this.reload.pipe(switchMap(() => fetchEntries(100)));
  getEntries(){
    this.reload.next();
    return this.entries;
  }
  constructor() { }
}
