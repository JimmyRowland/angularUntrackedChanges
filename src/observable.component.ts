import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, delay, map, merge, of, ReplaySubject, startWith, switchMap, tap } from 'rxjs';
import { DisableService } from './disable.service';
import { App } from './main';

@Component({
  selector: 'observable-disable-button',
  standalone: true,
  imports: [CommonModule],
  styles: ['.selected { background-color: yellow; }'],
  template: `
      <button [disabled]="isDisabled | async">disabled</button>
  `,
})
export class ObservableComponent {
  disabledSubject = new BehaviorSubject(false);

  @Input()
  set disabled(disabled: boolean | null) {
    if (disabled !== null) {
      this.disabledSubject.next(disabled)
    }
  }

  appComponent = inject(App);
  selectedDisabledEntry = this.appComponent.selected.pipe(switchMap(entry => merge(of(false), entry.editableSlow())), map(editable => !editable), startWith(true))

  isDisabled = combineLatest([this.disabledSubject, this.disableService.disabled$, this.selectedDisabledEntry]).pipe(map(([disabledProp, disabledService, seletedDisabled]) => disabledProp || disabledService || seletedDisabled))

  constructor(private disableService: DisableService) {
  }

}
