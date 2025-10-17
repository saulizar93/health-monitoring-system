import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { DbService } from '../../../services/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-metrics',
  imports: [CommonModule, FormsModule],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss',
})
export class MetricsComponent {
  user: User | null = null;
  message = '';

  constructor(private dBService: DbService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.user = nav?.extras.state?.['user'] ?? null;

    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  calculateBMI() {
    if (!this.user) return;
    const h = this.user.height / 100;
    this.user.bmi = parseFloat((this.user.weight / (h * h)).toFixed(2));
  }

  async save() {
    if (!this.user) return;
    this.calculateBMI();
    await this.dBService.updateUser(this.user);
    this.message = 'Metrics saved successfully';
  }

  async delete() {
    if (!this.user) return;
    await this.dBService.deleteUser(this.user.name);
    this.message = 'User deleted.';
    this.router.navigate(['/login']);
  }

  signOut() {
    this.router.navigate(['/login']);
  }
}
