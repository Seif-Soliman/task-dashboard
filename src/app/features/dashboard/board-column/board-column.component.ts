import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaskStatus, Task } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss',
})
export class BoardColumnComponent {
  readonly status = input.required<TaskStatus>();
  readonly title = input.required<string>();
  readonly tasks = input.required<readonly Task[]>();
  readonly edit = output<Task>();
}
