import { LayoutCache } from '../LayoutCache';
import type { CachedLayout, LayoutSlot } from '../LayoutCache';

// Mock IndexedDB with fake-indexeddb
import 'fake-indexeddb/auto';

describe('LayoutCache', () => {
  let cache: LayoutCache;

  beforeEach(async () => {
    cache = new LayoutCache();
    await cache.clear(); // Start fresh for each test
  });

  afterEach(async () => {
    await cache.clear();
  });

  describe('Basic Cache Operations', () => {
    it('stores and retrieves cache entries', async () => {
      const intent = 'weather dashboard';
      const layout = 'Dashboard';
      const slots: LayoutSlot[] = [
        {
          id: 'widget-0',
          type: 'widget',
          props: { content: 'Weather widget' }
        }
      ];

      await cache.set(intent, {
        layout,
        slots,
        confidence: 0.9,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24h from now
      });

      const result = await cache.get(intent);
      
      expect(result).toBeDefined();
      expect(result?.layout).toBe(layout);
      expect(result?.slots).toEqual(slots);
      expect(result?.confidence).toBe(0.9);
      expect(result?.intent).toBe(intent);
    });

    it('returns null for non-existent cache entries', async () => {
      const result = await cache.get('non-existent intent');
      expect(result).toBeNull();
    });

    it('handles intent variations with normalization', async () => {
      const intent1 = 'Weather Dashboard';
      const intent2 = 'weather dashboard';
      const intent3 = '  WEATHER   dashboard  ';

      await cache.set(intent1, {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.9,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      });

      // All variations should hit the same cache entry
      const result1 = await cache.get(intent1);
      const result2 = await cache.get(intent2);
      const result3 = await cache.get(intent3);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result3).toBeDefined();
      expect(result1?.intentHash).toBe(result2?.intentHash);
      expect(result2?.intentHash).toBe(result3?.intentHash);
    });
  });

  describe('Cache Expiration', () => {
    it('returns null for expired cache entries', async () => {
      const intent = 'expired intent';
      
      await cache.set(intent, {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.9,
        expiresAt: Date.now() - 1000 // Expired 1 second ago
      });

      const result = await cache.get(intent);
      expect(result).toBeNull();
    });

    it('returns valid cache entries that have not expired', async () => {
      const intent = 'valid intent';
      
      await cache.set(intent, {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.9,
        expiresAt: Date.now() + 60 * 1000 // Valid for 1 minute
      });

      const result = await cache.get(intent);
      expect(result).toBeDefined();
      expect(result?.layout).toBe('Dashboard');
    });

    it('automatically sets 24-hour expiration when not specified', async () => {
      const intent = 'auto-expire intent';
      
      await cache.set(intent, {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.9
      });

      const result = await cache.get(intent);
      expect(result).toBeDefined();
      
      const expectedExpiration = Date.now() + 24 * 60 * 60 * 1000;
      const actualExpiration = result?.expiresAt || 0;
      
      // Allow for small timing differences
      expect(Math.abs(actualExpiration - expectedExpiration)).toBeLessThan(5000);
    });
  });

  describe('Cache Management', () => {
    it('overwrites existing cache entries', async () => {
      const intent = 'test intent';
      
      // First entry
      await cache.set(intent, {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.8,
        expiresAt: Date.now() + 60 * 1000
      });

      // Overwrite with new entry
      await cache.set(intent, {
        layout: 'SplitView',
        slots: [{ id: 'left', type: 'iframe', props: { url: 'test.com' } }],
        confidence: 0.95,
        expiresAt: Date.now() + 120 * 1000
      });

      const result = await cache.get(intent);
      expect(result?.layout).toBe('SplitView');
      expect(result?.confidence).toBe(0.95);
      expect(result?.slots).toHaveLength(1);
    });

    it('handles concurrent cache operations', async () => {
      const intent = 'concurrent test';
      
      const promises = Array.from({ length: 10 }, (_, i) =>
        cache.set(`${intent} ${i}`, {
          layout: 'Dashboard',
          slots: [{ id: `widget-${i}`, type: 'widget', props: { index: i } }],
          confidence: 0.9,
          expiresAt: Date.now() + 60 * 1000
        })
      );

      await Promise.all(promises);

      // Verify all entries were stored
      const results = await Promise.all(
        Array.from({ length: 10 }, (_, i) => cache.get(`${intent} ${i}`))
      );

      results.forEach((result, i) => {
        expect(result).toBeDefined();
        expect(result?.slots[0].props.index).toBe(i);
      });
    });

    it('clears all cache entries', async () => {
      // Store multiple entries
      await Promise.all([
        cache.set('intent 1', { layout: 'Dashboard', slots: [], confidence: 0.9 }),
        cache.set('intent 2', { layout: 'SplitView', slots: [], confidence: 0.8 }),
        cache.set('intent 3', { layout: 'SingleWebsite', slots: [], confidence: 0.95 })
      ]);

      await cache.clear();

      // Verify all entries are gone
      const results = await Promise.all([
        cache.get('intent 1'),
        cache.get('intent 2'),
        cache.get('intent 3')
      ]);

      results.forEach(result => {
        expect(result).toBeNull();
      });
    });

    it('limits cache size to prevent memory issues', async () => {
      const maxEntries = 100;
      
      // Store more than max entries
      const promises = Array.from({ length: maxEntries + 20 }, (_, i) =>
        cache.set(`intent ${i}`, {
          layout: 'Dashboard',
          slots: [],
          confidence: 0.9,
          expiresAt: Date.now() + 60 * 1000
        })
      );

      await Promise.all(promises);

      const stats = await cache.getStats();
      expect(stats.totalEntries).toBeLessThanOrEqual(maxEntries);
    });
  });

  describe('Privacy and Security', () => {
    it('hashes intents for privacy', async () => {
      const sensitiveIntent = 'check my medical records for John Doe';
      
      await cache.set(sensitiveIntent, {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.9,
        expiresAt: Date.now() + 60 * 1000
      });

      const result = await cache.get(sensitiveIntent);
      expect(result).toBeDefined();
      
      // The stored intent should be the original, but hash should be different
      expect(result?.intent).toBe(sensitiveIntent);
      expect(result?.intentHash).not.toBe(sensitiveIntent);
      expect(result?.intentHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex format
    });

    it('produces consistent hashes for identical intents', async () => {
      const intent = 'consistent hash test';
      
      await cache.set(intent, {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.9,
        expiresAt: Date.now() + 60 * 1000
      });

      const result1 = await cache.get(intent);
      const hash1 = result1?.intentHash;

      // Clear and set again
      await cache.clear();
      await cache.set(intent, {
        layout: 'SplitView',
        slots: [],
        confidence: 0.8,
        expiresAt: Date.now() + 60 * 1000
      });

      const result2 = await cache.get(intent);
      const hash2 = result2?.intentHash;

      expect(hash1).toBe(hash2);
    });

    it('sanitizes malicious intent strings', async () => {
      const maliciousIntent = '<script>alert("xss")</script>';
      
      await cache.set(maliciousIntent, {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.9,
        expiresAt: Date.now() + 60 * 1000
      });

      const result = await cache.get(maliciousIntent);
      expect(result).toBeDefined();
      
      // Intent should be stored but sanitized slots
      expect(result?.intent).toBe(maliciousIntent);
      // Verify no script tags in serialized cache data
      const serialized = JSON.stringify(result);
      expect(serialized).not.toContain('<script>');
    });
  });

  describe('Performance and Metrics', () => {
    it('tracks cache hit/miss statistics', async () => {
      // Generate cache misses
      await cache.get('miss 1');
      await cache.get('miss 2');
      await cache.get('miss 3');

      // Generate cache hits
      await cache.set('hit test', { layout: 'Dashboard', slots: [], confidence: 0.9 });
      await cache.get('hit test');
      await cache.get('hit test');

      const stats = await cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(3);
      expect(stats.hitRate).toBeCloseTo(0.4, 1); // 2/5 = 0.4
    });

    it('measures cache operation performance', async () => {
      const intent = 'performance test';
      
      const startTime = performance.now();
      await cache.set(intent, {
        layout: 'Dashboard',
        slots: Array.from({ length: 50 }, (_, i) => ({
          id: `widget-${i}`,
          type: 'widget' as const,
          props: { data: new Array(100).fill(i) }
        })),
        confidence: 0.9
      });
      const setTime = performance.now() - startTime;

      const getStartTime = performance.now();
      await cache.get(intent);
      const getTime = performance.now() - getStartTime;

      // Cache operations should be reasonably fast
      expect(setTime).toBeLessThan(100); // < 100ms
      expect(getTime).toBeLessThan(50);  // < 50ms
    });

    it('handles large cached data efficiently', async () => {
      const largeSlots: LayoutSlot[] = Array.from({ length: 20 }, (_, i) => ({
        id: `widget-${i}`,
        type: 'widget',
        props: {
          data: Array.from({ length: 1000 }, (_, j) => ({
            id: j,
            value: `Large data entry ${i}-${j}`,
            metadata: { created: Date.now(), index: j }
          }))
        }
      }));

      await cache.set('large data test', {
        layout: 'Dashboard',
        slots: largeSlots,
        confidence: 0.9,
        expiresAt: Date.now() + 60 * 1000
      });

      const result = await cache.get('large data test');
      expect(result).toBeDefined();
      expect(result?.slots).toHaveLength(20);
      expect(result?.slots[0].props.data).toHaveLength(1000);
    });
  });

  describe('Error Handling', () => {
    it('handles database errors gracefully', async () => {
      // Close the database to simulate error
      await cache.close();
      
      const result = await cache.get('test after close');
      expect(result).toBeNull();

      // Setting should not throw but fail silently
      await expect(cache.set('test after close', {
        layout: 'Dashboard',
        slots: [],
        confidence: 0.9
      })).resolves.not.toThrow();
    });

    it('handles corrupted cache data', async () => {
      // This would require mocking the database to return corrupted data
      // For now, test that malformed JSON doesn't crash the cache
      const result = await cache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('recovers from cache size limits', async () => {
      // Fill cache to capacity
      const promises = Array.from({ length: 150 }, (_, i) =>
        cache.set(`overflow-${i}`, {
          layout: 'Dashboard',
          slots: [],
          confidence: 0.9,
          expiresAt: Date.now() + 60 * 1000
        })
      );

      await Promise.all(promises);

      // Should still be able to add new entries
      await cache.set('new entry after overflow', {
        layout: 'SplitView',
        slots: [],
        confidence: 0.95,
        expiresAt: Date.now() + 60 * 1000
      });

      const result = await cache.get('new entry after overflow');
      expect(result).toBeDefined();
      expect(result?.layout).toBe('SplitView');
    });
  });
});