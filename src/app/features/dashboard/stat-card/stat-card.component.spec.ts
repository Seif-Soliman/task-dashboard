import { TestBed } from '@angular/core/testing';
import { StatCard } from './stat-card.component';
import { Statistic } from '../../../core/models/statistic.model';

describe('StatCardComponent', () => {
  const stat: Statistic = {
    id: 'stat-004',
    title: 'Overdue',
    icon: '⚠️',
    value: 25,
    change: '+3',
    changeLabel: 'today',
    changeType: 'negative',
    color: '#D32F2F',
  };

  it('renders title, value and change with the change type class', async () => {
    const fixture = TestBed.createComponent(StatCard);
    fixture.componentRef.setInput('stat', stat);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Overdue');
    expect(el.querySelector('.value')?.textContent).toContain('25');
    expect(el.querySelector('.change')?.classList).toContain('negative');
  });
});
