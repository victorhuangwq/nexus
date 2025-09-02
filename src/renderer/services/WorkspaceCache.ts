/**
 * Workspace Cache System
 * Stores and retrieves previously generated workspaces with full state preservation
 */

// Removed state manager dependencies

export interface CachedWorkspace {
  id: string;
  intent: string;                    // Original user intent
  htmlContent: string;              // Generated workspace HTML
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

// Removed WorkspaceState interface - no longer tracking form state

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

    // Enhanced dynamic workspace previews with smarter categorization
    return this.generateSmartPreview(intent);
  }

  /**
   * Generate smart preview titles and descriptions for dynamic workspaces
   */
  private generateSmartPreview(intent: string): { title: string; description: string; icon: string } {
    const lowerIntent = intent.toLowerCase();
    
    // Financial & Crypto
    if (/crypto|bitcoin|btc|ethereum|eth|price|stock|trading|finance|investment/i.test(lowerIntent)) {
      const titles = ['Market Dashboard', 'Price Tracker', 'Crypto Monitor', 'Financial Hub'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '₿' 
      };
    }
    
    // Weather & Environment
    if (/weather|temperature|forecast|climate|rain|snow|storm|wind/i.test(lowerIntent)) {
      const titles = ['Weather Station', 'Climate Monitor', 'Forecast Center', 'Weather Hub'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '🌤️' 
      };
    }
    
    // Travel & Places
    if (/travel|trip|vacation|hotel|flight|city|country|visit|tour|plan/i.test(lowerIntent)) {
      const titles = ['Travel Planner', 'Trip Dashboard', 'Journey Hub', 'Travel Guide'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '✈️' 
      };
    }
    
    // Math & Calculations
    if (/math|calculate|equation|formula|solve|algebra|geometry|statistics/i.test(lowerIntent)) {
      const titles = ['Math Studio', 'Calculator Pro', 'Formula Hub', 'Math Tools'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '🧮' 
      };
    }
    
    // Research & Learning
    if (/research|study|learn|education|course|tutorial|guide|how to/i.test(lowerIntent)) {
      const titles = ['Research Hub', 'Study Center', 'Learning Lab', 'Knowledge Base'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '📚' 
      };
    }
    
    // Development & Code
    if (/code|programming|development|github|api|database|software|app/i.test(lowerIntent)) {
      const titles = ['Dev Console', 'Code Studio', 'Developer Hub', 'Tech Workspace'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '💻' 
      };
    }
    
    // Health & Fitness
    if (/health|fitness|exercise|diet|nutrition|medical|doctor|symptoms/i.test(lowerIntent)) {
      const titles = ['Health Hub', 'Wellness Center', 'Fitness Studio', 'Health Monitor'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '🏥' 
      };
    }
    
    // Shopping & Products
    if (/shop|buy|product|price|compare|deal|store|purchase/i.test(lowerIntent)) {
      const titles = ['Shopping Hub', 'Product Finder', 'Deal Center', 'Price Compare'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '🛍️' 
      };
    }
    
    // Entertainment & Media
    if (/movie|music|game|entertainment|video|watch|play|stream/i.test(lowerIntent)) {
      const titles = ['Media Center', 'Entertainment Hub', 'Content Studio', 'Media Dashboard'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '🎬' 
      };
    }
    
    // News & Information
    if (/news|current|events|information|update|latest|breaking/i.test(lowerIntent)) {
      const titles = ['News Center', 'Info Hub', 'Update Station', 'News Dashboard'];
      return { 
        title: this.selectRandomTitle(titles), 
        description: this.capitalizeFirst(intent), 
        icon: '📰' 
      };
    }
    
    // Default: Create a smart title from the intent
    return this.generateDefaultTitle(intent);
  }

  /**
   * Select a random title from an array
   */
  private selectRandomTitle(titles: string[]): string {
    return titles[Math.floor(Math.random() * titles.length)];
  }

  /**
   * Capitalize first letter of string
   */
  private capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Generate a default title when no category matches
   */
  private generateDefaultTitle(intent: string): { title: string; description: string; icon: string } {
    // Extract key words from intent to create a meaningful title
    const words = intent.toLowerCase().split(/\s+/);
    const meaningfulWords = words.filter(word => 
      word.length > 2 && 
      !['the', 'and', 'for', 'with', 'how', 'what', 'why', 'when', 'where'].includes(word)
    );
    
    if (meaningfulWords.length > 0) {
      // Create title from first 2-3 meaningful words
      const titleWords = meaningfulWords.slice(0, 3).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      );
      
      const title = titleWords.join(' ') + (meaningfulWords.length > 3 ? ' Hub' : ' Workspace');
      
      return {
        title: title.length > 25 ? titleWords.slice(0, 2).join(' ') + ' Hub' : title,
        description: this.capitalizeFirst(intent),
        icon: this.selectContextualIcon(meaningfulWords[0])
      };
    }
    
    // Fallback
    return { 
      title: intent.length > 25 ? intent.substring(0, 22) + '...' : intent, 
      description: 'Dynamic workspace', 
      icon: '💼' 
    };
  }

  /**
   * Select contextual icon based on the main word
   */
  private selectContextualIcon(mainWord: string): string {
    const iconMap: Record<string, string> = {
      'data': '📊', 'chart': '📈', 'graph': '📉', 'analytics': '📊',
      'email': '📧', 'message': '💬', 'chat': '💬', 'communication': '📞',
      'document': '📄', 'file': '📁', 'text': '📝', 'write': '✍️',
      'photo': '📸', 'image': '🖼️', 'picture': '🖼️', 'camera': '📷',
      'music': '🎵', 'audio': '🔊', 'sound': '🔊', 'song': '🎵',
      'calendar': '📅', 'schedule': '⏰', 'time': '⏰', 'date': '📅',
      'location': '📍', 'map': '🗺️', 'place': '📍', 'address': '📍',
      'security': '🔒', 'password': '🔑', 'login': '🔐', 'safe': '🔒',
      'book': '📚', 'read': '📖', 'library': '📚', 'article': '📄'
    };
    
    return iconMap[mainWord] || '💼';
  }

  /**
   * Cache a workspace
   */
  async cacheWorkspace(
    intent: string, 
    htmlContent: string, 
    workspaceType: 'static' | 'dynamic',
    component?: string
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

  // Removed state management methods - no longer tracking form state

  /**
   * Delete workspace from cache
   */
  async deleteWorkspace(id: string): Promise<boolean> {
    for (const [key, workspace] of this.cache.entries()) {
      if (workspace.id === id) {
        console.log(`🗑️ Deleting workspace: "${workspace.intent}"`);
        this.cache.delete(key);
        await this.persistCache();
        return true;
      }
    }
    console.warn(`Workspace ${id} not found for deletion`);
    return false;
  }

  /**
   * Clear all cached workspaces
   */
  async clearCache(): Promise<void> {
    const currentCount = this.cache.size;
    console.log(`🗑️ Clearing all workspace cache (${currentCount} workspaces)`);
    
    this.cache.clear();
    localStorage.removeItem('nexus_workspace_cache');
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