// handles persistence (indexedDB)
// provides methods like getUser(), addUser(), etc
// encapsulation of database logic
// Object Oriented Programming: separation of concerns

import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { User } from './user.class';

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase> {
    return openDB('HealthMetricsDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'name' });
        }
      },
    });
  }

  async addUser(user: User): Promise<void> {
    const db = await this.dbPromise;
    await db.put('users', user);
  }

  async getUser(username: string): Promise<User | undefined> {
    const db = await this.dbPromise;
    const found = await db.get('users', username);

    if (!found) return undefined;

    // since the indexedDB returns a plain object, we need to convert it back to a User instance
    return new User(
      found.name,
      found.password,
      found.dob,
      found.bloodPressure,
      found.weight,
      found.height,
      found.bmi
    );
  }

  async updateUser(user: User): Promise<void> {
    const db = await this.dbPromise;
    await db.put('users', user);
  }

  async deleteUser(username: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('users', username);
  }

  async getAllUsers(): Promise<User[]> {
    const db = await this.dbPromise;
    const all = await db.getAll('users');
    return all.map(
      (u) => new User(u.name, u.password, u.dob, u.bloodPressure, u.weight, u.height, u.bmi)
    );
  }

  async clearAllUsers(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('users');
  }
}
