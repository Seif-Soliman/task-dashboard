interface NavItem {
  path: string;
  labelKey: string;
  icon: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/dashboard', labelKey: 'nav.dashboard', icon: 'dashboard' },
  { path: '/analytics', labelKey: 'nav.analytics', icon: 'bar_chart' },
  { path: '/team', labelKey: 'nav.team', icon: 'group' },
  { path: '/settings', labelKey: 'nav.settings', icon: 'settings' },
];
