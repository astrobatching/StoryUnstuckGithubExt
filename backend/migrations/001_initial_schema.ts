```typescript
import type { Migration } from './index';
import type { StorageAdapter } from '../storage';

export const initialSchemaMigration: Migration = {
  version: '1.0.0',
  
  async up() {
    // Initialize default data structures
    const defaultData = {
      storylines: [],
      episodes: {},
      timeline: {
        height: 300,
        isCollapsed: false
      }
    };

    await this.storage.set('app_data', defaultData);
  },

  async down() {
    // Remove all data
    await this.storage.clear();
  }
};
```