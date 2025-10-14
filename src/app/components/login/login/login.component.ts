import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { DbService } from '../../../services/db.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  dob: string = '';
  bloodPressure: string = '';
  weight: number | null = null;
  height: number | null = null;

  currentUser: User | null = null;
  message: string = '';

  constructor(private dbService: DbService) {}

  async register() {
    if (!this.username) {
      this.message = 'Username is required!';
      return;
    }

    const existingUser = await this.dbService.getUser(this.username);
    if (existingUser) {
      this.message = 'Username already exists!';
      return;
    }

    const bmi = this.calculateBMI(this.weight || 0, this.height || 0);

    const newUser: User = {
      name: this.username,
      dob: this.dob,
      bloodPressure: this.bloodPressure,
      weight: this.weight || 0,
      height: this.height || 0,
      bmi,
    };

    await this.dbService.addUser(newUser);
    this.currentUser = newUser;
    this.message = `Registered successfully as ${this.username}`;
    this.clearForm();
  }

  async login() {
    if (!this.username) {
      this.message = 'Username is required!';
      return;
    }

    const user = await this.dbService.getUser(this.username);
    if (user) {
      this.currentUser = user;
      this.message = `Welcome back, ${user.name}`;
      this.clearForm();
    } else {
      this.message = 'User not found. Please register first';
    }
  }

  signOut() {
    this.currentUser = null;
    this.message = 'Signed out successfully!';
  }

  private calculateBMI(weight: number, height: number): number {
    if (height <= 0) return 0;
    const heightInMeters = height / 100;
    return parseFloat((weight / heightInMeters ** 2).toFixed(2));
  }

  private clearForm() {
    this.username = '';
    this.dob = '';
    this.bloodPressure = '';
    this.weight = null;
    this.height = null;
  }
}
