import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TasksService } from './tasks.service';
import { TaskDraft } from '../../../core/models/task.model';
import { makeTask } from '../../../core/utils/task.utils.spec';

describe('TasksService', () => {
  const existing = makeTask({ id: 't1' });
  const draft: TaskDraft = { ...existing, title: 'Changed' };
  let service: TasksService;
  let http: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        TasksService,
      ],
    });
    service = TestBed.inject(TasksService);
    http = TestBed.inject(HttpTestingController);
    const app = TestBed.inject(ApplicationRef);
    app.tick();
    http.expectOne('/api/tasks').flush([existing]);
    await app.whenStable();
  });

  it('appends a created task to the loaded list', () => {
    service.create(draft).subscribe();
    const req = http.expectOne({ method: 'POST', url: '/api/tasks' });
    expect(req.request.body.title).toBe('Changed');
    req.flush({ ...req.request.body, id: 't2' });

    expect(service.tasks.value()?.map((t) => t.id)).toEqual(['t1', 't2']);
  });

  it('replaces an updated task in the loaded list', () => {
    service.update(existing, draft).subscribe();
    const req = http.expectOne({ method: 'PUT', url: '/api/tasks/t1' });
    req.flush(req.request.body);

    expect(service.tasks.value()?.[0].title).toBe('Changed');
  });

  it('leaves the list untouched when the request fails', () => {
    service.create(draft).subscribe({ error: () => undefined });
    http.expectOne('/api/tasks').flush('boom', { status: 500, statusText: 'Server Error' });

    expect(service.tasks.value()?.length).toBe(1);
  });
});
