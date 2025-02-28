# Prompt Integration Guide

[Previous sections remain unchanged...]

## 9. Advanced Optimization

### A. Memory Management

```typescript
class MemoryManager {
  private static readonly MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
  private static readonly CLEANUP_THRESHOLD = 0.9; // 90%

  private memoryUsage = new Map<string, number>();
  private totalUsage = 0;

  track(key: string, size: number) {
    this.memoryUsage.set(key, size);
    this.totalUsage += size;

    if (this.totalUsage > MemoryManager.MAX_CACHE_SIZE * MemoryManager.CLEANUP_THRESHOLD) {
      this.cleanup();
    }
  }

  private cleanup() {
    const entries = Array.from(this.memoryUsage.entries())
      .sort(([, a], [, b]) => b - a);

    let freedSpace = 0;
    const targetReduction = this.totalUsage - (MemoryManager.MAX_CACHE_SIZE * 0.7);

    for (const [key, size] of entries) {
      this.memoryUsage.delete(key);
      freedSpace += size;
      if (freedSpace >= targetReduction) break;
    }

    this.totalUsage -= freedSpace;
  }
}
```

### B. Worker Thread Pool

```typescript
import { Worker } from 'worker_threads';

class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    task: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private activeWorkers = 0;

  constructor(private size: number, private workerScript: string) {
    for (let i = 0; i < size; i++) {
      this.workers.push(new Worker(workerScript));
    }
  }

  async execute(task: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.queue.length === 0 || this.activeWorkers >= this.size) {
      return;
    }

    const worker = this.workers[this.activeWorkers++];
    const { task, resolve, reject } = this.queue.shift()!;

    try {
      const result = await worker.postMessage(task);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.activeWorkers--;
      this.processQueue();
    }
  }
}
```

### C. Adaptive Rate Limiting

```typescript
class AdaptiveRateLimiter {
  private windowStats = new Map<string, {
    count: number;
    errors: number;
    latency: number[];
  }>();

  private readonly MAX_ERROR_RATE = 0.05; // 5%
  private readonly TARGET_LATENCY = 500; // 500ms

  async shouldAllow(key: string): Promise<boolean> {
    const stats = this.windowStats.get(key) || {
      count: 0,
      errors: 0,
      latency: []
    };

    // Calculate error rate
    const errorRate = stats.count > 0 ? stats.errors / stats.count : 0;
    if (errorRate > this.MAX_ERROR_RATE) {
      return false;
    }

    // Check average latency
    const avgLatency = stats.latency.length > 0
      ? stats.latency.reduce((a, b) => a + b) / stats.latency.length
      : 0;

    if (avgLatency > this.TARGET_LATENCY) {
      return false;
    }

    return true;
  }

  recordMetrics(key: string, latency: number, error: boolean) {
    const stats = this.windowStats.get(key) || {
      count: 0,
      errors: 0,
      latency: []
    };

    stats.count++;
    if (error) stats.errors++;
    stats.latency.push(latency);

    // Keep only last 100 latency samples
    if (stats.latency.length > 100) {
      stats.latency.shift();
    }

    this.windowStats.set(key, stats);
  }
}
```

### D. Circuit Breaker

```typescript
enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failures = 0;
  private lastFailure: number | null = null;
  private readonly FAILURE_THRESHOLD = 5;
  private readonly RESET_TIMEOUT = 30000; // 30 seconds

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldReset()) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();

    if (this.failures >= this.FAILURE_THRESHOLD) {
      this.state = CircuitState.OPEN;
    }
  }

  private shouldReset(): boolean {
    return this.lastFailure !== null &&
           Date.now() - this.lastFailure > this.RESET_TIMEOUT;
  }
}
```

### E. Metrics Collection

```typescript
class MetricsCollector {
  private metrics = new Map<string, {
    count: number;
    errors: number;
    latency: number[];
    lastUpdate: number;
  }>();

  record(metric: {
    name: string;
    value: number;
    error?: boolean;
    tags?: Record<string, string>;
  }) {
    const key = this.getMetricKey(metric.name, metric.tags);
    const stats = this.metrics.get(key) || {
      count: 0,
      errors: 0,
      latency: [],
      lastUpdate: Date.now()
    };

    stats.count++;
    if (metric.error) stats.errors++;
    stats.latency.push(metric.value);
    stats.lastUpdate = Date.now();

    this.metrics.set(key, stats);
  }

  getMetrics(): Record<string, {
    count: number;
    errorRate: number;
    avgLatency: number;
    p95Latency: number;
  }> {
    const result: Record<string, any> = {};

    for (const [key, stats] of this.metrics.entries()) {
      const sortedLatency = [...stats.latency].sort((a, b) => a - b);
      const p95Index = Math.floor(sortedLatency.length * 0.95);

      result[key] = {
        count: stats.count,
        errorRate: stats.errors / stats.count,
        avgLatency: stats.latency.reduce((a, b) => a + b) / stats.latency.length,
        p95Latency: sortedLatency[p95Index] || 0
      };
    }

    return result;
  }

  private getMetricKey(name: string, tags?: Record<string, string>): string {
    if (!tags) return name;
    const sortedTags = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${sortedTags}}`;
  }
}
```

This completes the integration guide with advanced optimization techniques for production deployment. These components provide robust memory management, worker thread pooling, adaptive rate limiting, circuit breaking, and comprehensive metrics collection.

The system is now ready for high-scale production use with proper monitoring, error handling, and performance optimization in place.