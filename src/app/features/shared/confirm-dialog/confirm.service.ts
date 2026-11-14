import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogData } from './model/confirm-dialog.model';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly dialog = inject(MatDialog);

  async ask(data: ConfirmDialogData): Promise<boolean> {
    const { ConfirmDialogComponent } = await import('./confirm-dialog.component');
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data,
      role: 'alertdialog',
      width: '420px',
      maxWidth: '95vw',
    });
    return (await firstValueFrom(ref.afterClosed())) === true;
  }
}
