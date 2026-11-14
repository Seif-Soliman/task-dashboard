import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { parseDateOnly } from '../../../core/utils/task.utils';
import { toFormValue, toTaskDraft } from '../../dashboard/task-builder/task-form.mapper';
import { TasksService } from '../tasks.service';
import { UsersService } from '../../dashboard/users.service';
import { getErrorMessage } from '../../shared/forms/form-errors';
import { notBlank, notBeforeToday, maxItems, uniqueValues } from '../../shared/forms/validators';
import {
  TASK_STATUSES,
  STATUS_LABELS,
  TASK_PRIORITIES,
  PRIORITY_LABELS,
} from '../../task-filter/model/task-options';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  DESCRIPTION_MAX,
  MAX_TAGS,
  TAG_MAX,
  TaskFormDialogData,
  TITLE_MAX,
} from './model/task-form-dialog.model';

@Component({
  selector: 'app-task-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.scss',
})
export class TaskFormDialogComponent {
  private readonly data = inject<TaskFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<TaskFormDialogComponent, Task>>(MatDialogRef);
  private readonly tasksService = inject(TasksService);
  private readonly users = inject(UsersService).users;
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tagInputs = viewChildren<ElementRef<HTMLInputElement>>('tagInput');

  protected readonly task = this.data.task;
  protected readonly isEdit = !!this.task;
  protected readonly descriptionMax = DESCRIPTION_MAX;
  protected readonly maxTags = MAX_TAGS;
  protected readonly messageFor = getErrorMessage;

  protected readonly saving = signal(false);
  protected readonly submitError = signal(false);
  protected readonly submitLabel = computed(() =>
    this.saving() ? 'Saving…' : this.isEdit ? 'Save changes' : 'Create task',
  );

  /** The current assignee stays selectable even if the users request failed or no longer lists them. */
  protected readonly assignees = computed(() => {
    const list = this.users.hasValue() ? this.users.value() : [];
    const current = this.task?.assignee;
    return current && !list.some((user) => user.id === current.id) ? [...list, current] : list;
  });

  protected readonly statusOptions = TASK_STATUSES.map((value) => ({
    value,
    label: STATUS_LABELS[value],
  }));
  protected readonly priorityOptions = TASK_PRIORITIES.map((value) => ({
    value,
    label: PRIORITY_LABELS[value],
  }));

  readonly form = this.fb.group({
    title: ['', [Validators.required, notBlank, Validators.maxLength(TITLE_MAX)]],
    description: ['', Validators.maxLength(DESCRIPTION_MAX)],
    status: this.fb.control<TaskStatus>('todo', Validators.required),
    priority: this.fb.control<TaskPriority>('medium', Validators.required),
    dueDate: this.fb.control<Date | null>(null, [
      Validators.required,
      notBeforeToday(this.task ? parseDateOnly(this.task.dueDate) : null),
    ]),
    assigneeId: ['', Validators.required],
    tags: this.fb.array<FormControl<string>>([], [maxItems(MAX_TAGS), uniqueValues]),
  });

  protected get tags() {
    return this.form.controls.tags;
  }

  protected readonly messages = {
    title: {
      required: 'Title is required',
      blank: 'Title can’t be only spaces',
      maxlength: `Title must be ${TITLE_MAX} characters or fewer`,
    },
    description: { maxlength: `Description must be ${DESCRIPTION_MAX} characters or fewer` },
    dueDate: {
      required: 'Due date is required',
      pastDate: 'Due date can’t be in the past',
      matDatepickerParse: 'Enter a valid date',
    },
    assigneeId: { required: 'Select an assignee' },
    tag: {
      required: 'Enter a tag or remove this row',
      blank: 'Tag can’t be only spaces',
      maxlength: `Tags must be ${TAG_MAX} characters or fewer`,
    },
    tags: { maxItems: `Use at most ${MAX_TAGS} tags`, duplicate: 'Tags must be unique' },
  } as const;

  constructor() {
    if (this.task) {
      const value = toFormValue(this.task);
      value.tags.forEach((tag) => this.tags.push(this.newTagControl(tag)));
      this.form.patchValue(value);
    }

    // Closing mid-request would hide a failure from the user.
    effect(() => {
      this.dialogRef.disableClose = this.saving();
    });
  }

  protected addTag(): void {
    this.tags.push(this.newTagControl());
    afterNextRender(() => this.tagInputs().at(-1)?.nativeElement.focus(), {
      injector: this.injector,
    });
  }

  protected removeTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  protected submit(): void {
    if (this.saving()) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.host.nativeElement
        .querySelector<HTMLElement>('input.ng-invalid, mat-select.ng-invalid')
        ?.focus();
      return;
    }

    const value = this.form.getRawValue();
    const assignee = this.assignees().find((user) => user.id === value.assigneeId);
    if (!value.dueDate || !assignee) return;

    const draft = toTaskDraft({ ...value, dueDate: value.dueDate }, assignee);
    const request$ = this.task
      ? this.tasksService.update(this.task, draft)
      : this.tasksService.create(draft);

    this.saving.set(true);
    this.submitError.set(false);
    request$
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (saved) => this.dialogRef.close(saved),
        error: () => this.submitError.set(true),
      });
  }

  private newTagControl(value = ''): FormControl<string> {
    return this.fb.control(value, [Validators.required, notBlank, Validators.maxLength(TAG_MAX)]);
  }
}
