import Dexie, { Table } from 'dexie';
import { UserSession } from './interfaces/UserSession';

export async function resetDatabase() {
  try {
    await db.delete();
    console.log("Offline database deleted successfully");
    window.location.reload();
  } catch (err) {
    console.error("Could not delete offline database", err);
  }
}

export class MyDatabase extends Dexie {
  session!: Table<UserSession>;

  constructor() {
    super('LyfieDatabase');
    this.version(1).stores({
      session: 'userId' // userId is the primary key
    });
  }
}

export const db = new MyDatabase();