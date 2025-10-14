import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportUser(user: User) {
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name}-health-record.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
