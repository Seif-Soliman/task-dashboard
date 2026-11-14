interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/tasks', label: 'Tasks', icon: 'task_alt' },
  { path: '/calendar', label: 'Calendar', icon: 'calendar_today' },
  { path: '/analytics', label: 'Analytics', icon: 'bar_chart' },
  { path: '/team', label: 'Team', icon: 'group' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];
