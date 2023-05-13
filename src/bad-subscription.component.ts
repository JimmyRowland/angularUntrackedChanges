import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, merge, of, startWith, switchMap} from 'rxjs';
import { DisableService } from './disable.service';
import { App } from './main';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bad-subscription-disable-button',
  standalone: true,
  imports: [CommonModule],
  template: `
      <button [disabled]="isDisabled">disabled {{renderCount}}</button>
  `,
})
export class BadSubscriptionComponent {
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

  constructor(private disableService: DisableService) {
    combineLatest([this.disabledSubject, this.appComponent.selected.pipe(startWith(undefined)), this.disableService.disabled$])
      .pipe(takeUntilDestroyed())
      .subscribe(([disabledProp, selection, disabledFromService])=>{
        if(selection){
          selection.editableSlow().then(editable => {
            this.updateIsDisabled(disabledProp, !editable, disabledFromService)
          })
        }
        this.updateIsDisabled(true, true, true);
      })
  }


  updateIsDisabled(disabledProp: boolean, disabledService: boolean, seletedDisabled: boolean){
    this.isDisabled = disabledProp || disabledService || seletedDisabled;
  }

}
