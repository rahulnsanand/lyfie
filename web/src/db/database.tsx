import Dexie, { Table } from 'dexie';
import { UserSession } from './interfaces/UserSession';


export class MyDatabase extends Dexie {
  session!: Table<UserSession>;

  constructor() {
    super('MyAppDatabase');
    this.version(1).stores({
      session: 'userId' // userId is the primary key
    });
  }
}

export const db = new MyDatabase();