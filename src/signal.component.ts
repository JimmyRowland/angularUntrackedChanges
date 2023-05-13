import { ChangeDetectionStrategy, Component, computed, effect, inject, Input, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableService } from './disable.service';
import { App } from './main';
import { toSignal } from '@angular/core/rxjs-interop';
import { from, map, merge, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'signal-disable-button',
  standalone: true,
  imports: [CommonModule],
  template: `
      <button [disabled]="isDisabled()">disabled {{renderCount}}</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalComponent{
  counter = 0;
  get renderCount(){
    this.counter += 1;
    return this.counter;
  }


  @Input({required: true})
  disabled!: Signal<boolean>

  appComponent = inject(App);
  // selectedDisabledEntry = signal(true);
  selectedDisabledEntry = toSignal(this.appComponent.selected.pipe(switchMap(entry => merge(of(false), entry.editableSlow())), map(editable => !editable), startWith(true)))
  // selectedDisabledEntry = computed(() => {
  //   const editablePromise = toSignal(this.appComponent.selected)()?.editableSlow();
  //   return editablePromise ? toSignal(from(editablePromise))() || false : true
  // })
  disabledFromService = toSignal(this.disableService.disabled$);

  isDisabled = computed(() => {
    return this.disabled?.() || this.selectedDisabledEntry() || this.disabledFromService()
  })

  constructor(private disableService: DisableService) {
  //   const selection = toSignal(this.appComponent.selected);
  //   effect(() => {
  //     this.selectedDisabledEntry?.set(true);
  //     selection()?.editableSlow().then(editable => this.selectedDisabledEntry.set(!editable))
  //   }, {allowSignalWrites: true})
  }
}
