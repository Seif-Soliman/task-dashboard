import { TestBed } from '@angular/core/testing';
import { TaskFormDialogComponent } from './task-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { makeTask } from '../../../core/utils/task.utils.spec';
import { TasksService } from '../tasks.service';
import { UsersService } from '../../dashboard/users.service';

describe('TaskFormDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { task: undefined } },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: TasksService, useValue: tasksService },
        {
          provide: UsersService,
          useValue: {
            users: {
              hasValue: () => true,
              value: () => [user],
            },
          },
        },
      ],
    }).compileComponents();
  });

  const user = makeTask().assignee;
  const saved = makeTask({ id: 'new' });
  const dialogRef = { close: vi.fn(), disableClose: false };
  const tasksService = { create: vi.fn(), update: vi.fn() };

  function setup(task?: ReturnType<typeof makeTask>) {
    dialogRef.close.mockClear();

    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: { task },
    });

    const fixture = TestBed.createComponent(TaskFormDialogComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;

    const submit = () => {
      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      fixture.detectChanges();
    };

    return {
      fixture,
      el,
      submit,
      form: fixture.componentInstance.form,
    };
  }

  const tomorrow = () => new Date(Date.now() + 86_400_000);

  it('shows validation errors and does not call the api when invalid', () => {
    tasksService.create.mockReset();
    const { el, submit } = setup();
    submit();

    expect(tasksService.create).not.toHaveBeenCalled();
    expect(el.textContent).toContain('Title is required');
    expect(el.textContent).toContain('Due date is required');
  });

  it('creates a task and closes with the saved result', () => {
    tasksService.create.mockReset().mockReturnValue(of(saved));
    const { form, submit } = setup();
    form.patchValue({ title: '  New task ', dueDate: tomorrow(), assigneeId: user.id });
    submit();

    expect(tasksService.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New task', priority: 'medium', status: 'todo' }),
    );
    expect(dialogRef.close).toHaveBeenCalledWith(saved);
  });

  it('keeps the dialog open and the input intact when saving fails', () => {
    tasksService.create.mockReset().mockReturnValue(throwError(() => new Error('boom')));
    const { el, form, submit } = setup();
    form.patchValue({ title: 'Keep me', dueDate: tomorrow(), assigneeId: user.id });
    submit();

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(el.querySelector('.submit-error')).not.toBeNull();
    expect(form.controls.title.value).toBe('Keep me');
    expect(el.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(false);
  });

  it('prefills the form when editing and updates instead of creating', () => {
    const task = makeTask({
      id: 't9',
      title: 'Existing',
      tags: ['Design', 'UI'],
      dueDate: '2000-01-01',
    });
    tasksService.update.mockReset().mockReturnValue(of(task));
    const { form, submit } = setup(task);

    expect(form.getRawValue()).toMatchObject({
      title: 'Existing',
      assigneeId: user.id,
      tags: ['Design', 'UI'],
    });
    submit();

    expect(tasksService.update).toHaveBeenCalledWith(
      task,
      expect.objectContaining({ title: 'Existing' }),
    );
  });
});
