```typescript
import React from 'react';

interface TestSpineProps {
  title: string;
}

export function TestSpine({ title }: TestSpineProps) {
  return (
    <div className="p-4 border-2 border-black rounded">
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}
```