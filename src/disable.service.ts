import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisableService {
  private readonly disabled = new BehaviorSubject(false);

  disabled$ = this.disabled.asObservable();

  toggleDisabled() {
    this.disabled.next(this.disabled.value);
  }

  constructor() {
  }
}
