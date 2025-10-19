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

  calculateBmi() {
    if (!this.user) return;
  
    const value = this.getBmi();
    if (!isFinite(value)) {
      this.message = 'Please enter valid weight and height first.';
      return;
    }
  
    this.user.bmi = value;

    this.message ='';
  }

  async save() {
    if (!this.user) return;
    this.calculateBmi();
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

  getBmi(): number {
    if (!this.user) return NaN;
    if (this.user.bmi && !isNaN(this.user.bmi)) return this.user.bmi;
    if (this.user.weight && this.user.height) {
      const hMeters = this.user.height > 3 ? this.user.height / 100 : this.user.height;
      const bmi = this.user.weight / (hMeters * hMeters);
      return Math.round(bmi * 10) / 10;
    }
    return NaN;
  }
  
  getBmiCategory(bmi?: number): string {
    const v = (typeof bmi === 'number' && !isNaN(bmi)) ? bmi : this.getBmi();
    if (!isFinite(v)) return '';
    if (v < 18.5) return 'Underweight';
    if (v < 25) return 'Healthy weight';
    if (v < 30) return 'Overweight';
    if (v < 35) return 'Obesity (Class 1)';
    if (v < 40) return 'Obesity (Class 2)';
    return 'Obesity (Class 3)';
  }

  getBmiColor(category: string): string {
    switch (category) {
      case 'Underweight':
        return 'text-info';       // light blue
      case 'Healthy weight':
        return 'text-success';    // green
      case 'Overweight':
        return 'text-warning';    // yellow
      case 'Obesity (Class 1)':
        return 'text-orange';     // orange (Bootstrap doesn’t have this, may need custom CSS)
      case 'Obesity (Class 2)':
      case 'Obesity (Class 3)':
        return 'text-danger';     // red
      default:
        return 'text-muted';
    }
  }

  onMetricsChanged() {
    if (!this.user) return;
  
    const weight = Number(this.user.weight);
    const height = Number(this.user.height);
  
    if (!weight || !height || height <= 0) {
      this.user.bmi = undefined as any;
      return;
    }
  
    const h = height > 3 ? height / 100 : height;
    this.user.bmi = Math.round((weight / (h * h)) * 10) / 10;
  }
}
