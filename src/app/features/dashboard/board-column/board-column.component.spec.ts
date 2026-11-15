import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardColumnComponent } from './board-column.component';

describe('BoardColumnComponent', () => {
  let fixture: ComponentFixture<BoardColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardColumnComponent);
    fixture.componentRef.setInput('status', 'todo');
    fixture.componentRef.setInput('title', 'To Do');
    fixture.componentRef.setInput('tasks', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
