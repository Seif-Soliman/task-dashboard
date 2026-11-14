const fs = require('fs');
const path = require('path');

const read = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
const startOfToday = new Date().setHours(0, 0, 0, 0);
const isOverdue = (task) =>
  task.status !== 'done' && new Date(`${task.dueDate}T00:00:00`).getTime() < startOfToday;

/** Gives every task a rank within its column: overdue first, then priority, then due date. */
function withOrder(tasks) {
  const ranked = [...tasks].sort(
    (a, b) =>
      Number(isOverdue(b)) - Number(isOverdue(a)) ||
      PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
      a.dueDate.localeCompare(b.dueDate),
  );
  const counters = {};
  const orderById = new Map(
    ranked.map((task) => {
      counters[task.status] = (counters[task.status] ?? 0) + 1000;
      return [task.id, counters[task.status]];
    }),
  );
  return tasks.map((task) => ({ ...task, order: orderById.get(task.id) }));
}

const { tasks: seedTasks } = read('tasks.json');
const tasks = withOrder(seedTasks);
const { statistics } = read('statistics.json');

// Unique assignees become the "users" collection
const users = [...new Map(tasks.map((t) => [t.assignee.id, t.assignee])).values()];

// Derive an activity feed from task dates.
// We store a type + task title instead of a sentence, so the UI can translate it later (i18n).
const activities = tasks
  .flatMap((task) => {
    const base = { taskId: task.id, taskTitle: task.title, user: task.assignee };
    const items = [{ ...base, type: 'created', createdAt: task.createdAt }];

    if (task.status === 'done' && task.completedAt) {
      items.push({ ...base, type: 'completed', createdAt: task.completedAt });
    } else if (task.updatedAt !== task.createdAt) {
      items.push({ ...base, type: 'updated', createdAt: task.updatedAt });
    }
    return items;
  })
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((activity, index) => ({ id: `act-${String(index + 1).padStart(3, '0')}`, ...activity }));

const db = { tasks, statistics, users, activities };

fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2), 'utf8');
console.log(
  `✅ db.json built: ${tasks.length} tasks, ${users.length} users, ${activities.length} activities`,
);
