import { ChangeDetectionStrategy, Component, computed, effect, inject, Input, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, merge, of, startWith, switchMap } from 'rxjs';
import { DisableService } from './disable.service';
import { App } from './main';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'signal-disable-button',
  standalone: true,
  imports: [CommonModule],
  template: `
      <button [disabled]="isDisabled()">disabled {{renderCount}}</button>
      {{selection()?.name}}
  `
})
export class SignalComponent {
  counter = 0;
  get renderCount(){
    this.counter += 1;
    return this.counter;
  }


  @Input({required: true})
  disabled!: Signal<boolean>

  appComponent = inject(App);
  selection = toSignal(this.appComponent.selected);
  selectedDisabledEntry = signal(true);
  disabledFromService = toSignal(this.disableService.disabled$);

  isDisabled = computed(() => {
    console.log(this.disabled, this.disabled?.())
    return this.disabled?.() || this.selectedDisabledEntry() || this.disabledFromService()
  })

  constructor(private disableService: DisableService) {
    console.log('signal')
    this.appComponent.selected.pipe(takeUntilDestroyed()).subscribe(console.log)
    effect(() => {
      console.log('effect')
      this.selectedDisabledEntry.set(true);
      this.selection()?.editableSlow().then(editable => this.selectedDisabledEntry.set(!editable))
    })
    setTimeout(() => {
      console.log('timeout')
      effect(() => {
        console.log('effect')
        this.selectedDisabledEntry.set(true);
        this.selection()?.editableSlow().then(editable => this.selectedDisabledEntry.set(!editable))
      })
    }, 2000)

  }

}
