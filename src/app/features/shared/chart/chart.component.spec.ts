import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ChartConfiguration } from 'chart.js';
import { CHART_FACTORY, ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  const configOf = (values: number[]): ChartConfiguration => ({
    type: 'bar',
    data: { labels: ['a', 'b'], datasets: [{ data: values }] },
  });

  function setup(initial = configOf([1, 2])) {
    const handle = { data: {}, options: {}, update: vi.fn(), destroy: vi.fn() };
    const factory = vi.fn().mockReturnValue(handle);
    TestBed.configureTestingModule({
      providers: [{ provide: CHART_FACTORY, useValue: factory }, provideZonelessChangeDetection()],
    });

    const fixture = TestBed.createComponent(ChartComponent);
    fixture.componentRef.setInput('config', initial);
    fixture.componentRef.setInput('ariaLabel', 'Tasks by status: a 1, b 2');
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick();
    return { fixture, handle, factory };
  }

  afterEach(() => vi.unstubAllGlobals());

  it('creates the chart on the canvas once rendered and labels it for assistive tech', () => {
    const { fixture, factory } = setup();
    const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('canvas');

    expect(factory).toHaveBeenCalledOnce();
    expect(factory).toHaveBeenCalledWith(canvas, expect.objectContaining({ type: 'bar' }));
    expect(canvas.getAttribute('aria-label')).toBe('Tasks by status: a 1, b 2');
  });

  it('pushes new data to the existing chart instead of recreating it', () => {
    const { fixture, handle, factory } = setup();
    const next = configOf([5, 6]);
    fixture.componentRef.setInput('config', next);
    fixture.detectChanges();

    expect(factory).toHaveBeenCalledOnce();
    expect(handle.data).toBe(next.data);
    expect(handle.update).toHaveBeenCalled();
  });

  it('destroys the chart with the component', () => {
    const { fixture, handle } = setup();
    fixture.destroy();
    expect(handle.destroy).toHaveBeenCalled();
  });

  it('turns animation off for users who prefer reduced motion', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    const { factory } = setup();
    expect(factory).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ options: expect.objectContaining({ animation: false }) }),
    );
  });
});
