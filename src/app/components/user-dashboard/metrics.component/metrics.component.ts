// most calls service methods and User methods
// logic like BMI calculation is offloaded to the User class
// Components should focus on UI and orchestration, not business logic
// Object-Oriented Programming

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../classes/user.class';
import { DbService } from '../../classes/dbService.class';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss',
})
export class MetricsComponent {
  user: User | null = null;
  message = '';

  constructor(private dbService: DbService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const plainUser = nav?.extras.state?.['user'] ?? null;

    if (plainUser) {
      // since indexedDb returns plain objects, re-hydrate into User class
      this.user = new User(
        plainUser.name,
        plainUser.password,
        plainUser.dob,
        plainUser.bloodPressure,
        plainUser.weight,
        plainUser.height,
        plainUser.bmi
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  onMetricsChanged() {
    if (!this.user) return;
    this.user.calculateBmi();
  }

  getBmiCategory(): string {
    return this.user ? this.user.getBmiCategory() : '';
  }

  getBmiColor(category?: string): string {
    if (!this.user) return 'text-muted';
    return this.user.getBmiColor();
  }

  async save() {
    if (!this.user) return;
    this.user.calculateBmi();
    await this.dbService.updateUser(this.user);
    this.message = 'Metrics saved successfully';
  }

  async delete() {
    if (!this.user) return;
    await this.dbService.deleteUser(this.user.name);
    this.router.navigate(['/login']);
  }

  signOut() {
    this.router.navigate(['/login']);
  }
}
