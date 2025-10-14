import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { User } from '../models/user.model';

interface HealthDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
}

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbPromise: Promise<IDBPDatabase<HealthDB>>;

  constructor() {
    this.dbPromise = openDB<HealthDB>('health-db', 1, {
      upgrade(db) {
        db.createObjectStore('users', { keyPath: 'name' });
      },
    });
  }

  async addUser(user: User) {
    const db = await this.dbPromise;
    return db.put('users', user);
  }

  async getUser(name: string) {
    const db = await this.dbPromise;
    return db.get('users', name);
  }

  async updateUser(user: User) {
    const db = await this.dbPromise;
    return db.put('users', user);
  }
}
