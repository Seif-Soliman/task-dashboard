import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivityRecorder } from './activity-recorder.service';
import { makeTask } from '../../../core/utils/task.utils.spec';

describe('ActivityRecorder', () => {
  let recorder: ActivityRecorder;
  let http: HttpTestingController;
  const task = makeTask({ id: 't1', title: 'Fix bug', status: 'todo' });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    recorder = TestBed.inject(ActivityRecorder);
    http = TestBed.inject(HttpTestingController);
  });

  it('posts a created entry attributed to the current user', () => {
    recorder.created(task);
    const req = http.expectOne({ method: 'POST', url: '/api/activities' });
    expect(req.request.body).toMatchObject({
      type: 'created',
      taskId: 't1',
      taskTitle: 'Fix bug',
      user: { id: 'user-001' },
    });
    req.flush({});
  });

  it('posts a completion when a task moves to done', () => {
    recorder.changed(task, { ...task, status: 'done' });
    const req = http.expectOne('/api/activities');
    expect(req.request.body).toMatchObject({ type: 'completed', from: 'todo', to: 'done' });
    req.flush({});
  });

  it('swallows failures so the user action is never affected', () => {
    recorder.deleted(task);
    expect(() =>
      http.expectOne('/api/activities').flush('boom', { status: 500, statusText: 'Server Error' }),
    ).not.toThrow();
  });
});
