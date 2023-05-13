import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, merge, of, startWith, switchMap} from 'rxjs';
import { DisableService } from './disable.service';
import { App } from './main';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'subscription-disable-button',
  standalone: true,
  imports: [CommonModule],
  template: `
      <button [disabled]="isDisabled">disabled {{renderCount}}</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionComponent {
  counter = 0;
  get renderCount(){
    this.counter += 1;
    return this.counter;
  }

  disabledSubject = new BehaviorSubject(false);
  @Input()
  set disabled(disabled: boolean | null) {
    if (disabled !== null) {
      this.disabledSubject.next(disabled)
    }
  }

  appComponent = inject(App);

  isDisabled = true;

  constructor(private disableService: DisableService, cdr: ChangeDetectorRef) {
    combineLatest([this.disabledSubject,
      this.appComponent.selected.pipe(switchMap(entry => merge(of(false), entry.editableSlow())), map(editable => !editable), startWith(true)),
      this.disableService.disabled$])
      .pipe(takeUntilDestroyed())
      .subscribe(([disabledProp, seletedDisabledEntry, disabledFromService])=>{
        this.updateIsDisabled(disabledProp, seletedDisabledEntry, disabledFromService);
        cdr.markForCheck()
      })
  }


  updateIsDisabled(disabledProp: boolean, disabledService: boolean, seletedDisabled: boolean){
    this.isDisabled = disabledProp || disabledService || seletedDisabled;
  }

}
