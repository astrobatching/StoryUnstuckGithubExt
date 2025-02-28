```typescript
// Configuration for different environments
export const config = {
  development: {
    storage: {
      type: 'localStorage',
      prefix: 'story_unstuck_dev_'
    },
    api: {
      baseUrl: process.env.API_URL || 'http://localhost:3000'
    }
  },
  production: {
    storage: {
      type: 'replitDb',
      prefix: 'story_unstuck_'
    },
    api: {
      baseUrl: process.env.API_URL
    }
  }
};
```