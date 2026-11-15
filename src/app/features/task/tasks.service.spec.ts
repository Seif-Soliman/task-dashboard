import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { TasksService } from './tasks.service';
import { TaskDraft } from '../../core/models/task.model';
import { makeTask } from '../../core/utils/task.utils.spec';

describe('TasksService', () => {
  const existing = makeTask({ id: 't1', order: 1000 });
  const other = makeTask({ id: 't2', order: 2000 });
  const draft: TaskDraft = { ...existing, title: 'Changed' };

  let service: TasksService;
  let http: HttpTestingController;
  let recorder: { created: Mock; changed: Mock; deleted: Mock };

  beforeEach(async () => {
    recorder = {
      created: vi.fn(),
      changed: vi.fn(),
      deleted: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TasksService],
    });

    service = TestBed.inject(TasksService);
    http = TestBed.inject(HttpTestingController);

    const app = TestBed.inject(ApplicationRef);
    app.tick();

    http.expectOne('/api/tasks').flush([existing, other]);
    await app.whenStable();
  });

  it('appends a created task to the loaded list', () => {
    service.create(draft).subscribe();

    const req = http.expectOne({ method: 'POST', url: '/api/tasks' });
    expect(req.request.body.title).toBe('Changed');

    req.flush({ ...req.request.body, id: 't2' });

    expect(service.tasks.value()?.map((t) => t.id)).toEqual(['t1', 't2', 't2']);
    expect(req.request.body.order).toBe(3000);
    expect(recorder.created).toHaveBeenCalledWith(expect.objectContaining({ id: 't3' }));
  });

  it('replaces an updated task in the loaded list', () => {
    service.update(existing, draft).subscribe();

    const req = http.expectOne({ method: 'PUT', url: '/api/tasks/t1' });
    req.flush(req.request.body);

    expect(service.tasks.value()?.[0].title).toBe('Changed');
  });

  it('leaves the list untouched when the request fails', () => {
    service.create(draft).subscribe({ error: () => undefined });

    http.expectOne('/api/tasks').flush('boom', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(service.tasks.value()?.length).toBe(2);
    expect(recorder.created).not.toHaveBeenCalled();
  });

  it('keeps the rank when the status is unchanged', () => {
    service.update(existing, draft).subscribe();

    const req = http.expectOne({ method: 'PUT', url: '/api/tasks/t1' });
    expect(req.request.body.order).toBe(1000);

    req.flush(req.request.body);
  });

  it('appends to the new column when the status changes', () => {
    service.update(existing, { ...draft, status: 'done' }).subscribe();

    const req = http.expectOne({ method: 'PUT', url: '/api/tasks/t1' });
    expect(req.request.body).toMatchObject({
      status: 'done',
      order: 1000,
    });

    req.flush(req.request.body);

    expect(recorder.changed).toHaveBeenCalledWith(
      existing,
      expect.objectContaining({ status: 'done' }),
    );
  });

  describe('move', () => {
    const find = (id: string) => service.tasks.value()?.find((t) => t.id === id);

    it('updates the board immediately and saves status and rank', () => {
      service.move(existing, 'done').subscribe();

      expect(find('t1')).toMatchObject({
        status: 'done',
        order: 1000,
      });

      const req = http.expectOne({ method: 'PUT', url: '/api/tasks/t1' });

      expect(req.request.body).toMatchObject({
        status: 'done',
        order: 1000,
        completedAt: expect.any(String),
      });

      req.flush({});
    });

    it('ranks between neighbours', () => {
      service.move(other, 'todo', undefined, 1000).subscribe();

      expect(find('t2')?.order).toBe(0);

      http.expectOne('/api/tasks/t2').flush({});
    });

    it('appends to the end of the target column', () => {
      service.moveToEnd(existing, 'todo').subscribe();

      expect(find('t1')?.order).toBe(3000);

      http.expectOne('/api/tasks/t1').flush({});
    });

    it('puts the task back when the save fails', () => {
      service.move(existing, 'done').subscribe({
        error: () => undefined,
      });

      http.expectOne('/api/tasks/t1').flush('boom', {
        status: 500,
        statusText: 'Server Error',
      });

      expect(find('t1')).toEqual(existing);
    });

    it('logs a move to another column', () => {
      service.move(existing, 'done').subscribe();

      http.expectOne('/api/tasks/t1').flush({});

      expect(recorder.changed).toHaveBeenCalledWith(
        existing,
        expect.objectContaining({ status: 'done' }),
      );
    });

    it('does not log a reorder inside the same column', () => {
      service.move(other, 'todo', undefined, 1000).subscribe();

      http.expectOne('/api/tasks/t2').flush({});

      expect(recorder.changed).not.toHaveBeenCalled();
    });

    it('does not log a failed move', () => {
      service.move(existing, 'done').subscribe({
        error: () => undefined,
      });

      http.expectOne('/api/tasks/t1').flush('boom', {
        status: 500,
        statusText: 'Server Error',
      });

      expect(recorder.changed).not.toHaveBeenCalled();
    });
  });
});
