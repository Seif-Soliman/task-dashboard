import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaskStatus, Task } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskDrop, TaskMove } from './model/board-column.model';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [TaskCardComponent, CdkDropList, CdkDrag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss',
})
export class BoardColumnComponent {
  readonly status = input.required<TaskStatus>();
  readonly title = input.required<string>();
  readonly tasks = input.required<readonly Task[]>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();
  readonly taskDropped = output<TaskDrop>();
  readonly moveTo = output<TaskMove>();

  protected readonly dragStartDelay = { touch: 200, mouse: 0 };

  protected onDrop(event: CdkDragDrop<TaskStatus, TaskStatus, Task>): void {
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex)
      return;
    this.taskDropped.emit({
      task: event.item.data,
      status: this.status(),
      index: event.currentIndex,
    });
  }
}
