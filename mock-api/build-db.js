const fs = require('fs');
const path = require('path');

const read = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));

const { tasks } = read('tasks.json');
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
