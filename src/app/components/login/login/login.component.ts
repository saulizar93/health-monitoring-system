import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { DbService } from '../../../services/db.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password = '';
  message = '';

  constructor(private dbService: DbService, private router: Router) {}

  async register() {
    if (!this.username || !this.password) {
      this.message = 'Both username and password are required!';
      return;
    }

    const existingUser = await this.dbService.getUser(this.username);
    if (existingUser) {
      this.message = 'Username already exists!';
      return;
    }

    const newUser: User = {
      name: this.username,
      password: this.password,
      dob: '',
      bloodPressure: '',
      weight: 0,
      height: 0,
      bmi: 0,
    };
    await this.dbService.addUser(newUser);

    this.password = '';
    this.message = 'Registration successful! You can now log in.';
  }

  async login() {
    if (!this.username || !this.password) {
      this.message = 'Both username and password are required!';
      return;
    }

    const user = await this.dbService.getUser(this.username);
    if (!user) {
      this.message = 'User not found. Please register first.';
      return;
    }

    if (user.password != this.password) {
      this.message = 'Incorrect password';
      return;
    }

    this.message = `Welcome back, ${user.name}!`;

    this.router.navigate(['/metrics'], { state: { user } });
  }
}
