import Dexie, { Table } from 'dexie';
import type { LayoutSlot } from '../layouts/types';

export { LayoutSlot };

export interface CachedLayout {
  id?: number; // Auto-generated primary key
  intent: string;
  intentHash: string; // SHA-256 for privacy and indexing
  layout: string;
  slots: LayoutSlot[];
  confidence: number;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  totalEntries: number;
  hits: number;
  misses: number;
  hitRate: number;
  oldestEntry?: number;
  newestEntry?: number;
}

class LayoutCacheDB extends Dexie {
  layouts!: Table<CachedLayout>;

  constructor() {
    super('LayoutCache');
    this.version(1).stores({
      layouts: '++id, intentHash, expiresAt, timestamp'
    });
  }
}

export class LayoutCache {
  private db: LayoutCacheDB;
  private stats = {
    hits: 0,
    misses: 0
  };
  private readonly MAX_ENTRIES = 100;
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.db = new LayoutCacheDB();
  }

  async get(intent: string): Promise<CachedLayout | null> {
    try {
      const normalizedIntent = this.normalizeIntent(intent);
      const hash = await this.hashIntent(normalizedIntent);
      
      // Find by hash and check expiration
      const cached = await this.db.layouts
        .where('intentHash')
        .equals(hash)
        .first();

      if (!cached) {
        this.stats.misses++;
        return null;
      }

      // Check if expired
      if (cached.expiresAt <= Date.now()) {
        // Remove expired entry
        await this.db.layouts.delete(cached.id!);
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return cached;
    } catch (error) {
      console.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  async set(intent: string, data: Omit<CachedLayout, 'id' | 'intent' | 'intentHash' | 'timestamp' | 'expiresAt'> & { expiresAt?: number }): Promise<void> {
    try {
      const normalizedIntent = this.normalizeIntent(intent);
      const hash = await this.hashIntent(normalizedIntent);
      
      const entry: Omit<CachedLayout, 'id'> = {
        intent: normalizedIntent,
        intentHash: hash,
        layout: data.layout,
        slots: this.sanitizeSlots(data.slots),
        confidence: data.confidence,
        timestamp: Date.now(),
        expiresAt: data.expiresAt || (Date.now() + this.DEFAULT_TTL)
      };

      // Check if entry already exists and update, otherwise add
      const existing = await this.db.layouts
        .where('intentHash')
        .equals(hash)
        .first();

      if (existing) {
        await this.db.layouts.update(existing.id!, entry);
      } else {
        // Check cache size limit
        await this.enforceStorageLimit();
        await this.db.layouts.add(entry as CachedLayout);
      }
    } catch (error) {
      console.error('Cache set error:', error);
      // Fail silently to not break the user experience
    }
  }

  async clear(): Promise<void> {
    try {
      await this.db.layouts.clear();
      this.stats.hits = 0;
      this.stats.misses = 0;
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async close(): Promise<void> {
    try {
      await this.db.close();
    } catch (error) {
      console.error('Cache close error:', error);
    }
  }

  async getStats(): Promise<CacheStats> {
    try {
      const totalEntries = await this.db.layouts.count();
      const hitRate = this.stats.hits + this.stats.misses > 0 
        ? this.stats.hits / (this.stats.hits + this.stats.misses) 
        : 0;

      // Get oldest and newest entries
      const oldest = await this.db.layouts.orderBy('timestamp').first();
      const newest = await this.db.layouts.orderBy('timestamp').last();

      return {
        totalEntries,
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate,
        oldestEntry: oldest?.timestamp,
        newestEntry: newest?.timestamp
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        totalEntries: 0,
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate: 0
      };
    }
  }

  private normalizeIntent(intent: string): string {
    return intent.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  private async hashIntent(intent: string): Promise<string> {
    try {
      // Use Web Crypto API for SHA-256 hashing
      const encoder = new TextEncoder();
      const data = encoder.encode(intent);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      // Fallback to simple hash for testing environments
      let hash = 0;
      for (let i = 0; i < intent.length; i++) {
        const char = intent.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(16).padStart(16, '0').repeat(4); // 64 chars
    }
  }

  private sanitizeSlots(slots: LayoutSlot[]): LayoutSlot[] {
    return slots.map(slot => ({
      ...slot,
      props: this.sanitizeProps(slot.props),
      component: slot.component ? this.sanitizeComponent(slot.component) : undefined
    }));
  }

  private sanitizeProps(props: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'string') {
        // Remove script tags and event handlers
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize objects
        sanitized[key] = this.sanitizeProps(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  private sanitizeComponent(component: string): string {
    return component
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  private async enforceStorageLimit(): Promise<void> {
    try {
      const count = await this.db.layouts.count();
      
      if (count >= this.MAX_ENTRIES) {
        // Remove oldest entries (by timestamp) to make room
        const entriesToRemove = count - this.MAX_ENTRIES + 10; // Remove 10 extra for buffer
        const oldestEntries = await this.db.layouts
          .orderBy('timestamp')
          .limit(entriesToRemove)
          .toArray();

        const idsToDelete = oldestEntries.map(entry => entry.id!);
        await this.db.layouts.bulkDelete(idsToDelete);
      }
    } catch (error) {
      console.error('Cache storage limit enforcement error:', error);
    }
  }

  // Clean up expired entries (can be called periodically)
  async cleanupExpired(): Promise<number> {
    try {
      const now = Date.now();
      const expiredEntries = await this.db.layouts
        .where('expiresAt')
        .below(now)
        .toArray();

      if (expiredEntries.length > 0) {
        const idsToDelete = expiredEntries.map(entry => entry.id!);
        await this.db.layouts.bulkDelete(idsToDelete);
      }

      return expiredEntries.length;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const layoutCache = new LayoutCache();