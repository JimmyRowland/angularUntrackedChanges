import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, merge, of, startWith, switchMap} from 'rxjs';
import { DisableService } from './disable.service';
import { App } from './main';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'broken-subscription-disable-button',
  standalone: true,
  imports: [CommonModule],
  template: `
      <button [disabled]="isDisabled">disabled {{renderCount}}</button>
  `,
})
export class BrokenSubscriptionComponent {
  counter = 0;
  get renderCount(){
    this.counter += 1;
    return this.counter;
  }

  @Input()
  disabled: boolean | null = false;

  appComponent = inject(App);

  isDisabled = true;

  constructor(private disableService: DisableService) {
    combineLatest([this.appComponent.selected.pipe(startWith(undefined)), this.disableService.disabled$])
      .pipe(takeUntilDestroyed())
      .subscribe(([selection, disabledFromService])=>{
        if(selection){
          selection.editableSlow().then(editable => {
            this.updateIsDisabled(!!this.disabled, !editable, disabledFromService)
          })
        }
        this.updateIsDisabled(true, true, true);
      })
  }


  updateIsDisabled(disabledProp: boolean, disabledService: boolean, seletedDisabled: boolean){
    this.isDisabled = disabledProp || disabledService || seletedDisabled;
  }

}
