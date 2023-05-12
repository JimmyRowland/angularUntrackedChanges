import 'zone.js/dist/zone';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { BehaviorSubject, delay, ReplaySubject, switchMap, tap } from 'rxjs';
import { EntriesService } from 'src/entries.service';
import { FormsModule } from '@angular/forms';
import { Entry } from 'src/utils/fetch';
import { ObservableComponent } from 'src/observable.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule, ObservableComponent],
  styles: ['.selected { background-color: yellow; }'],
  template: `
    <div>
        <input [type]="'checkbox'" (change)="toggleDisabled()" [checked]="disabledSubject | async" />
        <label>disabled</label>
    </div>
    <div>
        components
    </div>
    <div>
        <input [type]="'checkbox'" [(ngModel)]="observableVisible" />
        <div>{{observableVisible}}</div>
        <label>observable button</label>
        <observable-disable-button *ngIf="observableVisible" [disabled]="expensiveCalculatedDisabled | async"></observable-disable-button>
    </div>
    <div>
        <input [type]="'checkbox'" [ngModel]="subscriptionVisible" />
        <label>subscription button</label>
    </div>
    <div>
        <input [type]="'checkbox'" [ngModel]="memoVisible" />
        <label>memo button</label>
    </div>
    <div>
        <input [type]="'checkbox'" [ngModel]="signalVisible" />
        <label>signal button</label>
    </div>
    <ng-container *ngIf="entries|async as entries">
        <div *ngFor="let entry of entries" (click)="select(entry)" [class.selected]="(selected | async) === entry">
            {{entry.name}}
        </div>
    </ng-container>

  `,
})
export class App {
  entriesService = inject(EntriesService);
  entries = this.entriesService.getEntries().pipe(tap(console.log));
  disabledSubject = new BehaviorSubject(false);
  expensiveCalculatedDisabled = this.disabledSubject.pipe(delay(1000));
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

  observableVisible = false;
  memoVisible = false;
  subscriptionVisible = false;
  signalVisible = false;
}

bootstrapApplication(App);
