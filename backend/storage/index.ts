```typescript
// Storage adapter interface
export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Local storage adapter
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private prefix: string) {}

  async get(key: string) {
    const value = localStorage.getItem(this.prefix + key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }

  async delete(key: string) {
    localStorage.removeItem(this.prefix + key);
  }

  async clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

// Replit DB adapter
export class ReplitDbAdapter implements StorageAdapter {
  constructor(private prefix: string, private db: any) {}

  async get(key: string) {
    return this.db.get(this.prefix + key);
  }

  async set(key: string, value: any) {
    await this.db.set(this.prefix + key, value);
  }

  async delete(key: string) {
    await this.db.delete(this.prefix + key);
  }

  async clear() {
    const keys = await this.db.list(this.prefix);
    await Promise.all(keys.map(key => this.db.delete(key)));
  }
}
```