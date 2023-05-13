import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map, merge, of, startWith, switchMap } from 'rxjs';
import { DisableService } from './disable.service';
import { App } from './main';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Compare previous arguments with new arguments in memo function
 */
function hasDifferentArgs(prev: unknown[], next: unknown[]) {
  if (prev.length !== next.length) {
    return true;
  }
  for (let i = 0; i < prev.length; i++) {
    if (!Object.is(prev[i], next[i])) {
      return true;
    }
  }
  return false;
}

/**
 *  return a memorized function.
 *  If memorized function is called with the same arguments twice,
 *  the second function call will return the memorized result from previous function call
 */
export function memo<Func extends (...args: any[]) => any>(fnToMemorize: Func) {
  let prevArgs: unknown[] = [{}];
  let result: any;

  return function (...newArgs: Parameters<Func>): ReturnType<Func> {
    if (hasDifferentArgs(prevArgs, newArgs)) {
      result = fnToMemorize(...newArgs);
      prevArgs = newArgs;
    }
    return result;
  };
}
@Component({
  selector: 'memo-disable-button',
  standalone: true,
  imports: [CommonModule],
  template: `
      <button [disabled]="getDisabled(!!disabled, selectedDisabledEntry, disabledFromService)">disabled {{renderCount}}</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoComponent {
  counter = 0;
  get renderCount(){
    this.counter += 1;
    return this.counter;
  }

  @Input()
  disabled: boolean | null = false;

  appComponent = inject(App);

  selectedDisabledEntry = true;
  disabledFromService = true;

  constructor(private disableService: DisableService, cdr: ChangeDetectorRef) {
    this.appComponent.selected.pipe(
      switchMap(entry => merge(of(false), entry.editableSlow())),
      map(editable => !editable),
      startWith(true),
      takeUntilDestroyed()
    ).subscribe(selectedDisabledEntry => {
      this.selectedDisabledEntry = selectedDisabledEntry;
      cdr.markForCheck()
    })
    this.disableService.disabled$.pipe(takeUntilDestroyed()).subscribe(
      disabled => {
        this.disabledFromService = disabled;
        cdr.markForCheck()
      }
    )
  }

  getDisabled = memo((disabledProp: boolean, selectedDisabled: boolean, disabledFromService: boolean) => {
    console.log('calculate');
    return disabledProp || selectedDisabled || disabledFromService
  })

}
