import { ChartConfiguration } from 'chart.js';

export const tooltip = (rtl: boolean) => ({ rtl, textDirection: rtl ? 'rtl' : 'ltr' });

export function doughnutOptions(rtl: boolean): ChartConfiguration['options'] {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: tooltip(rtl) },
  };
}

export function barOptions(rtl: boolean): ChartConfiguration['options'] {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: tooltip(rtl) },
    scales: {
      x: { reverse: rtl },
      y: { beginAtZero: true, ticks: { precision: 0 }, position: rtl ? 'right' : 'left' },
    },
  };
}
