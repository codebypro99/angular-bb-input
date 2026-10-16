import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-bb-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './bb-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BbInputComponent implements ControlValueAccessor, OnInit {
  readonly label = input('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly inputName = input('');
  readonly inputID = input.required<string>();
  readonly autocomplete = input('off');
  readonly inputMode = input('');
  readonly pattern = input<string>();
  readonly maxLength = input<number>();
  readonly inputClass = input('');
  readonly matFormFieldClass = input('');
  readonly matFormFieldName = input('');
  readonly labelName = input('');
  readonly matHintName = input('');
  readonly matHintClass = input('');
  readonly errorsMsgs = input<Readonly<Record<string, string>>>({});
  readonly currencySymbol = input('');
  readonly showWarning = input(false);
  readonly warningText = input('');
  readonly warningHintClass = input('');
  readonly warningHintName = input('');

  readonly onFocus = output<void>();
  readonly onBlur = output<FocusEvent>();
  readonly onInput = output<string>();
  readonly onkeyDown = output<KeyboardEvent>();
  readonly enterPress = output<KeyboardEvent>();
  readonly keyUp = output<KeyboardEvent>();

  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly control = inject(NgControl, { self: true, optional: true });
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    if (this.control) this.control.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control?.control?.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changeDetector.markForCheck());
  }

  protected get showError(): boolean {
    return !!(this.control?.invalid && this.control.touched);
  }

  protected get errorMessage(): string {
    const errors = this.control?.errors;
    const key = errors ? Object.keys(errors)[0] : undefined;
    return key ? this.errorsMsgs()[key] ?? 'Enter a valid value.' : '';
  }

  protected readonly errorStateMatcher = {
    isErrorState: (): boolean => this.showError,
  };

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
    this.onInput.emit(value);
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    this.onkeyDown.emit(event);
    if (event.key === 'Enter') this.enterPress.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  writeValue(value: unknown): void {
    this.value.set(value == null ? '' : String(value));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}

