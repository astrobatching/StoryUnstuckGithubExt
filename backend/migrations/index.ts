```typescript
export interface Migration {
  version: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

export class MigrationManager {
  private migrations: Migration[] = [];

  constructor(private storage: StorageAdapter) {}

  addMigration(migration: Migration) {
    this.migrations.push(migration);
  }

  async getCurrentVersion(): Promise<string> {
    return await this.storage.get('schema_version') || '0.0.0';
  }

  async migrate(targetVersion: string) {
    const currentVersion = await this.getCurrentVersion();
    
    // Sort migrations by version
    this.migrations.sort((a, b) => 
      this.compareVersions(a.version, b.version)
    );

    if (this.compareVersions(targetVersion, currentVersion) > 0) {
      // Migrate up
      for (const migration of this.migrations) {
        if (this.compareVersions(migration.version, currentVersion) > 0 &&
            this.compareVersions(migration.version, targetVersion) <= 0) {
          await migration.up();
        }
      }
    } else {
      // Migrate down
      for (const migration of this.migrations.reverse()) {
        if (this.compareVersions(migration.version, currentVersion) <= 0 &&
            this.compareVersions(migration.version, targetVersion) > 0) {
          await migration.down();
        }
      }
    }

    await this.storage.set('schema_version', targetVersion);
  }

  private compareVersions(a: string, b: string): number {
    const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.split('.').map(Number);

    if (aMajor !== bMajor) return aMajor - bMajor;
    if (aMinor !== bMinor) return aMinor - bMinor;
    return aPatch - bPatch;
  }
}
```