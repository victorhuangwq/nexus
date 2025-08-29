/**
 * Workspace Cache System
 * Stores and retrieves previously generated workspaces with full state preservation
 */

export interface CachedWorkspace {
  id: string;
  intent: string;                    // Original user intent
  htmlContent: string;              // Generated workspace HTML
  state: WorkspaceState;            // Dynamic state data
  metadata: {
    createdAt: Date;
    lastAccessedAt: Date;
    accessCount: number;
    tags: string[];                 // Auto-generated from intent
    workspaceType: 'static' | 'dynamic';
    component?: string;             // For static workspaces
  };
  preview: {
    title: string;                  // Display title
    description: string;            // Brief description
    icon: string;                   // Emoji or icon
  };
}

export interface WorkspaceState {
  inputValues: Record<string, string>;     // Form inputs, search queries
  scrollPositions: Record<string, number>; // Scroll state of iframes/panels
  activeTab: string;                       // Which tab/panel was active
  customizations: Record<string, any>;     // User modifications
  lastCursorPosition?: {                   // For text inputs
    elementId: string;
    position: number;
  };
}

export class WorkspaceCache {
  private static instance: WorkspaceCache;
  private cache: Map<string, CachedWorkspace> = new Map();
  private maxCacheSize = 50; // Maximum number of cached workspaces
  
  static getInstance(): WorkspaceCache {
    if (!WorkspaceCache.instance) {
      WorkspaceCache.instance = new WorkspaceCache();
    }
    return WorkspaceCache.instance;
  }

  /**
   * Generate cache key from intent
   */
  private generateCacheKey(intent: string): string {
    return intent.toLowerCase().trim().replace(/\s+/g, '_');
  }

  /**
   * Generate tags from intent for categorization
   */
  private generateTags(intent: string): string[] {
    const commonTags: Record<string, string[]> = {
      'crypto|bitcoin|btc|ethereum': ['finance', 'crypto'],
      'weather|temperature|forecast': ['weather'],
      'travel|trip|kyoto|tokyo': ['travel'],
      'calculator|math|equation': ['math', 'calculator'],
      'physics|homework|formulas': ['education', 'physics'],
    };

    const tags: string[] = [];
    const lowerIntent = intent.toLowerCase();

    for (const [pattern, tagSet] of Object.entries(commonTags)) {
      if (new RegExp(pattern).test(lowerIntent)) {
        tags.push(...tagSet);
      }
    }

    // Add generic tags
    if (tags.length === 0) {
      tags.push('general');
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Generate preview information from intent and content
   */
  private generatePreview(intent: string, component?: string): { title: string; description: string; icon: string } {
    const lowerIntent = intent.toLowerCase();
    
    // Static component previews
    if (component) {
      const previews: Record<string, { title: string; description: string; icon: string }> = {
        'BTCChart': { title: 'Bitcoin Tracker', description: 'Crypto prices and charts', icon: '₿' },
        'WeatherWidget': { title: 'Weather Forecast', description: 'Weather and radar maps', icon: '🌤️' },
        'GraphingCalculator': { title: 'Calculator', description: 'Math and graphing tools', icon: '🧮' },
        'PhysicsHomework': { title: 'Physics Tools', description: 'Formulas and calculator', icon: '⚡' },
        'TokyoTrip': { title: 'Trip Planner', description: 'Travel itinerary and maps', icon: '🗾' },
      };
      return previews[component] || { title: intent, description: 'Workspace', icon: '💼' };
    }

    // Dynamic workspace previews based on intent
    if (/crypto|bitcoin|btc/i.test(lowerIntent)) {
      return { title: 'Crypto Tracker', description: intent, icon: '₿' };
    }
    if (/weather|temperature/i.test(lowerIntent)) {
      return { title: 'Weather Info', description: intent, icon: '🌤️' };
    }
    if (/travel|trip|plan/i.test(lowerIntent)) {
      return { title: 'Travel Planner', description: intent, icon: '✈️' };
    }
    if (/calculator|math/i.test(lowerIntent)) {
      return { title: 'Calculator', description: intent, icon: '🧮' };
    }
    if (/research|study/i.test(lowerIntent)) {
      return { title: 'Research', description: intent, icon: '📚' };
    }

    return { 
      title: intent.length > 30 ? intent.substring(0, 30) + '...' : intent, 
      description: 'Custom workspace', 
      icon: '💼' 
    };
  }

  /**
   * Cache a workspace
   */
  async cacheWorkspace(
    intent: string, 
    htmlContent: string, 
    workspaceType: 'static' | 'dynamic',
    component?: string,
    initialState?: Partial<WorkspaceState>
  ): Promise<string> {
    const cacheKey = this.generateCacheKey(intent);
    const now = new Date();

    // Check if already cached and update access time
    const existing = this.cache.get(cacheKey);
    if (existing) {
      existing.metadata.lastAccessedAt = now;
      existing.metadata.accessCount++;
      return existing.id;
    }

    // Create new cache entry
    const cachedWorkspace: CachedWorkspace = {
      id: `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      intent,
      htmlContent,
      state: {
        inputValues: {},
        scrollPositions: {},
        activeTab: '',
        customizations: {},
        ...initialState,
      },
      metadata: {
        createdAt: now,
        lastAccessedAt: now,
        accessCount: 1,
        tags: this.generateTags(intent),
        workspaceType,
        component,
      },
      preview: this.generatePreview(intent, component),
    };

    // Add to cache
    this.cache.set(cacheKey, cachedWorkspace);

    // Enforce cache size limit (LRU eviction)
    if (this.cache.size > this.maxCacheSize) {
      const oldestKey = this.findLeastRecentlyUsed();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    // TODO: Persist to local storage/SQLite
    await this.persistCache();

    return cachedWorkspace.id;
  }

  /**
   * Find workspace by intent
   */
  findByIntent(intent: string): CachedWorkspace | null {
    const cacheKey = this.generateCacheKey(intent);
    return this.cache.get(cacheKey) || null;
  }

  /**
   * Find workspace by ID
   */
  findById(id: string): CachedWorkspace | null {
    for (const workspace of this.cache.values()) {
      if (workspace.id === id) {
        return workspace;
      }
    }
    return null;
  }

  /**
   * Get recent workspaces for homepage display
   */
  getRecentWorkspaces(limit: number = 6): CachedWorkspace[] {
    return Array.from(this.cache.values())
      .sort((a, b) => b.metadata.lastAccessedAt.getTime() - a.metadata.lastAccessedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get workspaces by tag
   */
  getWorkspacesByTag(tag: string): CachedWorkspace[] {
    return Array.from(this.cache.values())
      .filter(workspace => workspace.metadata.tags.includes(tag))
      .sort((a, b) => b.metadata.lastAccessedAt.getTime() - a.metadata.lastAccessedAt.getTime());
  }

  /**
   * Update workspace state
   */
  async updateWorkspaceState(id: string, stateUpdate: Partial<WorkspaceState>): Promise<boolean> {
    const workspace = this.findById(id);
    if (!workspace) {
      return false;
    }

    workspace.state = {
      ...workspace.state,
      ...stateUpdate,
    };
    workspace.metadata.lastAccessedAt = new Date();

    await this.persistCache();
    return true;
  }

  /**
   * Delete workspace from cache
   */
  async deleteWorkspace(id: string): Promise<boolean> {
    for (const [key, workspace] of this.cache.entries()) {
      if (workspace.id === id) {
        this.cache.delete(key);
        await this.persistCache();
        return true;
      }
    }
    return false;
  }

  /**
   * Clear all cached workspaces
   */
  async clearCache(): Promise<void> {
    this.cache.clear();
    await this.persistCache();
  }

  /**
   * Find least recently used workspace for eviction
   */
  private findLeastRecentlyUsed(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, workspace] of this.cache.entries()) {
      const lastAccessed = workspace.metadata.lastAccessedAt.getTime();
      if (lastAccessed < oldestTime) {
        oldestTime = lastAccessed;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Persist cache to local storage (simplified for now)
   * TODO: Implement SQLite storage for production
   */
  private async persistCache(): Promise<void> {
    try {
      const cacheData = Array.from(this.cache.entries()).map(([key, workspace]) => ({
        key,
        workspace: {
          ...workspace,
          metadata: {
            ...workspace.metadata,
            createdAt: workspace.metadata.createdAt.toISOString(),
            lastAccessedAt: workspace.metadata.lastAccessedAt.toISOString(),
          },
        },
      }));

      localStorage.setItem('nexus_workspace_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to persist workspace cache:', error);
    }
  }

  /**
   * Load cache from local storage
   */
  async loadCache(): Promise<void> {
    try {
      const cacheData = localStorage.getItem('nexus_workspace_cache');
      if (!cacheData) return;

      const parsed = JSON.parse(cacheData);
      this.cache.clear();

      for (const { key, workspace } of parsed) {
        // Convert date strings back to Date objects
        workspace.metadata.createdAt = new Date(workspace.metadata.createdAt);
        workspace.metadata.lastAccessedAt = new Date(workspace.metadata.lastAccessedAt);
        this.cache.set(key, workspace);
      }
    } catch (error) {
      console.error('Failed to load workspace cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const workspaces = Array.from(this.cache.values());
    return {
      totalWorkspaces: workspaces.length,
      staticWorkspaces: workspaces.filter(w => w.metadata.workspaceType === 'static').length,
      dynamicWorkspaces: workspaces.filter(w => w.metadata.workspaceType === 'dynamic').length,
      totalAccesses: workspaces.reduce((sum, w) => sum + w.metadata.accessCount, 0),
      oldestWorkspace: workspaces.reduce((oldest, w) => 
        !oldest || w.metadata.createdAt < oldest.metadata.createdAt ? w : oldest, null as CachedWorkspace | null
      )?.metadata.createdAt,
      newestWorkspace: workspaces.reduce((newest, w) => 
        !newest || w.metadata.createdAt > newest.metadata.createdAt ? w : newest, null as CachedWorkspace | null
      )?.metadata.createdAt,
    };
  }
}

// Export singleton instance
export const workspaceCache = WorkspaceCache.getInstance();