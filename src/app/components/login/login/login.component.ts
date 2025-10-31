// most calls service methods and User methods
// logic like BMI calculation is offloaded to the User class
// Components should focus on UI and orchestration, not business logic
// Object-Oriented Programming
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../classes/user.class';
import { DbService } from '../../classes/dbService.class';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
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

    const newUser = new User(this.username, this.password);
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

    if (user.password !== this.password) {
      this.message = 'Incorrect password';
      return;
    }

    this.router.navigate(['/metrics'], { state: { user } });
  }
}
