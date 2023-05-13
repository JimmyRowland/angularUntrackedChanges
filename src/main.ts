import 'zone.js/dist/zone';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { BehaviorSubject, delay, ReplaySubject, switchMap, tap } from 'rxjs';
import { EntriesService } from './entries.service';
import { FormsModule } from '@angular/forms';
import { Entry } from './utils/fetch';
import { ObservableComponent } from './observable.component';
import { BadSubscriptionComponent } from 'src/bad-subscription.component';
import { SubscriptionComponent } from 'src/subscription.component';
import { BrokenSubscriptionComponent } from 'src/broken-subscription.component';
import { MemoComponent } from 'src/memo.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { SignalComponent } from 'src/signal.component';
import { DisableService } from 'src/disable.service';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule, ObservableComponent, BrokenSubscriptionComponent, SubscriptionComponent, BrokenSubscriptionComponent, BrokenSubscriptionComponent, BadSubscriptionComponent, MemoComponent, SignalComponent],
  styles: ['.selected { background-color: yellow; }'],
  template: `
      <div>
          <label> <input type="checkbox" (change)="toggleDisabled()"
                         [checked]="disabledSubject | async"/>disabled prop</label>
          <label> <input type="checkbox" (change)="disabledService.toggleDisabled()"
                         [checked]="disabledService.disabled$ | async"/>disabled service</label>
      </div>
      <div>
          components
      </div>
      <div>
          <label><input type="checkbox" [(ngModel)]="observableVisible">observable button</label>
          <observable-disable-button *ngIf="observableVisible"
                                     [disabled]="expensiveCalculatedDisabled | async"></observable-disable-button>
      </div>
      <div>
          <label><input type="checkbox" [(ngModel)]="badSubscriptionVisible"/>bad subscription button</label>
          <bad-subscription-disable-button *ngIf="badSubscriptionVisible"
                                           [disabled]="expensiveCalculatedDisabled | async"></bad-subscription-disable-button>
      </div>
      <div>
          <label><input type="checkbox" [(ngModel)]="brokenSubscriptionVisible"/>broken subscription button</label>
          <broken-subscription-disable-button *ngIf="brokenSubscriptionVisible"
                                           [disabled]="expensiveCalculatedDisabled | async"></broken-subscription-disable-button>
      </div>
      <div>
          <label><input type="checkbox" [(ngModel)]="subscriptionVisible"/>subscription button</label>
          <subscription-disable-button *ngIf="subscriptionVisible"
                                           [disabled]="expensiveCalculatedDisabled | async"></subscription-disable-button>
      </div>
      <div>
          <label><input type="checkbox" [(ngModel)]="memoVisible"/>memo button</label>
          <memo-disable-button *ngIf="memoVisible"
                               [disabled]="expensiveCalculatedDisabled | async"></memo-disable-button>
      </div>
      <div>
          <label><input type="checkbox" [(ngModel)]="signalVisible"/>signal button</label>
          <signal-disable-button *ngIf="signalVisible"
                               [disabled]="expensiveCalculatedSignal"></signal-disable-button>
      </div>
      <ng-container *ngIf="entries|async as entries">
          <div *ngFor="let entry of entries" (click)="select(entry)" [class.selected]="(selected | async) === entry">
              {{entry.name}}
          </div>
      </ng-container>

  `,
})
export class App {
  constructor(private entriesService: EntriesService, readonly disabledService: DisableService) {
  }
  entries = this.entriesService.getEntries().pipe(tap(console.log));
  disabledSubject = new BehaviorSubject(false);
  expensiveCalculatedDisabled = this.disabledSubject.pipe(delay(1000));
  expensiveCalculatedSignal = toSignal(this.expensiveCalculatedDisabled, {initialValue: false});
  selected = new ReplaySubject<Entry>()
  select(entry: Entry){
    this.selected.next(entry);
  }
  toggleDisabled(){
    this.disabledSubject.next(!this.disabledSubject.value)
  }
  change(e: any){
    console.log(e.target.value)
  }

  observableVisible = true;
  memoVisible = true;
  badSubscriptionVisible = true;
  brokenSubscriptionVisible = true;
  subscriptionVisible = true;
  signalVisible = true;
}

bootstrapApplication(App);
