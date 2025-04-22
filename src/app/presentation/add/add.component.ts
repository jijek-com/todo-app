import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { CommonModule, Location } from '@angular/common';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Router } from "@angular/router";
import { TodosService } from "../list/todo.service";
import { Todo } from "../list/list.type";

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatIcon,
    MatIconButton,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddComponent implements OnInit {
  public minDate: string;
  public minTime: string;

  public submitted = false;

  public form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    expirationDate: [null, [Validators.required, this.dateValidator]],
    expirationTime: ['', [this.timeValidator]],
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private todosService: TodosService,
    private location: Location,
    private router: Router)
  {
    const today = new Date();
    this.minDate = today.toLocaleDateString('en-CA');
    this.minTime = today.toTimeString().slice(0, 5);
  }

  public ngOnInit(): void {
    this.form.get('expirationDate')?.valueChanges.subscribe(date => {
      if (!date) return;

      const selected = new Date(date);
      const now = new Date();
      this.minTime = selected.toDateString() === now.toDateString()
        ? now.toTimeString().slice(0, 5)
        : '00:00';

      this.validateDateAndTime();
    });

    this.form.get('expirationTime')?.valueChanges.subscribe(() => {
      this.validateDateAndTime();
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched || this.submitted);
  }

  public getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || control.valid) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('maxlength')) return 'Max 100 characters';
    if (control.hasError('invalidDate')) return 'Date must be in the future';
    if (control.hasError('invalidTime')) return 'Time must be in the future';

    return '';
  }

  public onSubmit(): void {
    this.submitted = true;

    const { expirationDate, expirationTime, title } = this.form.value as {
      title: string;
      expirationDate: string | null;
      expirationTime?: string | null;
    };

    if (expirationDate) {
      const date = new Date(expirationDate);
      if (expirationTime?.trim()) {
        const [hours, minutes] = expirationTime.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
      }

      if (date <= new Date()) {
        this.form.get('expirationDate')?.setErrors({ invalidDate: true });
        this.form.get('expirationTime')?.setErrors({ invalidTime: true });
        return;
      }
    }

    if (this.form.invalid) return;

    const today = new Date();

    const todo: Todo = {
      id: new Date().toISOString(),
      title: title ?? '',
      expirationDate: expirationDate ?? '',
      expirationTime: expirationTime ?? undefined,
      createdAt: today.toLocaleDateString('en-CA'),
      favorite: false
    };

    this.todosService.add(todo).subscribe(() => {
      this.router.navigate(['/list']);
    });
  }

  public onTimepickerOpen(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    this.minTime = `${hours}:${minutes}`;
  }

  public onChangeTimePicker(): void {
    this.cdr.markForCheck();
  }

  private validateDateAndTime(): void {
    const expirationDate = this.form.get('expirationDate')?.value;
    const expirationTime = this.form.get('expirationTime')?.value;

    if (expirationDate && expirationTime) {
      const date = new Date(expirationDate);
      const [hours, minutes] = expirationTime.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);

      if (date <= new Date()) {
        this.form.get('expirationDate')?.setErrors({ invalidDate: true });
        this.form.get('expirationTime')?.setErrors({ invalidTime: true });
      } else {
        this.form.get('expirationDate')?.setErrors(null);
        this.form.get('expirationTime')?.setErrors(null);
      }
    }
  }

  private timeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const time = control.value;

    if (!time) return null;

    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
      return { invalidTime: true };
    }

    const expirationDate = this.form.get('expirationDate')?.value;
    if (expirationDate) {
      const selectedDate = new Date(expirationDate);
      selectedDate.setHours(hours, minutes, 0, 0);

      if (selectedDate <= new Date()) {
        return { invalidTime: true };
      }
    }

    return null;
  }

  private dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const date = new Date(control.value);
    const now = new Date();

    if (date <= now) {
      return { invalidDate: true };
    }

    return null;
  }
}
