/**
 * Dynamic Workspace Generator
 * Inspired by gemini-os's approach to generating interactive HTML content
 * This service generates complete workspace UIs dynamically based on user intent
 */

import { WORKSPACE_SYSTEM_PROMPT, WORKSPACE_CSS, EXAMPLE_WORKSPACES } from './workspacePrompts';

export interface InteractionData {
  id: string;
  type: string;
  value?: string;
  elementType: string;
  elementText: string;
  workspaceContext: string | null;
  timestamp: number;
}

export interface WorkspaceGenerationResult {
  htmlContent: string;
  metadata: {
    tools: string[];
    primaryAction: string;
    estimatedDuration?: string;
  };
  interactions: InteractionData[];
}

export class DynamicWorkspaceGenerator {
  private interactionHistory: InteractionData[] = [];
  private workspaceCache: Map<string, WorkspaceGenerationResult> = new Map();
  private maxHistoryLength: number = 10;

  /**
   * Generate a complete workspace HTML based on user intent
   * This follows gemini-os's pattern of generating complete HTML with embedded interactions
   */
  async generateWorkspace(intent: string): Promise<WorkspaceGenerationResult> {
    // Check cache first
    const cacheKey = this.generateCacheKey(intent);
    if (this.workspaceCache.has(cacheKey)) {
      return this.workspaceCache.get(cacheKey)!;
    }

    try {
      // Call the AI to generate workspace HTML
      const result = await this.callAIForWorkspace(intent);
      
      // Cache the result
      this.workspaceCache.set(cacheKey, result);
      
      // Limit cache size
      if (this.workspaceCache.size > 20) {
        const firstKey = this.workspaceCache.keys().next().value;
        this.workspaceCache.delete(firstKey);
      }
      
      return result;
    } catch (error) {
      console.error('Workspace generation failed:', error);
      return this.generateFallbackWorkspace(intent);
    }
  }

  /**
   * Handle user interaction within generated workspace
   * This tracks interactions similar to gemini-os's approach
   */
  async handleInteraction(interaction: InteractionData): Promise<WorkspaceGenerationResult> {
    // Add to history
    this.interactionHistory.unshift(interaction);
    if (this.interactionHistory.length > this.maxHistoryLength) {
      this.interactionHistory.pop();
    }

    // Generate new workspace based on interaction
    const contextualIntent = this.buildContextualIntent(interaction);
    return this.generateWorkspace(contextualIntent);
  }

  /**
   * Call AI to generate workspace HTML
   * This is where we'll integrate with Claude API
   */
  private async callAIForWorkspace(intent: string): Promise<WorkspaceGenerationResult> {
    const prompt = this.buildPrompt(intent);
    
    console.log('=== SENDING PROMPT TO CLAUDE ===');
    console.log(prompt);
    
    // Use the bridge to call Claude
    const response = await window.bridge.callClaude('workspace_generation', {
      prompt,
      type: 'workspace_generation'
    });

    console.log('=== CLAUDE RESPONSE ===');
    console.log('Success:', response.success);
    console.log('Response type:', typeof response.data);
    console.log('Response length:', response.data?.length);
    console.log('First 1000 chars:', response.data?.substring(0, 1000));
    
    if (!response.success) {
      throw new Error('AI generation failed');
    }

    // Parse the response to extract HTML and metadata
    const { htmlContent, metadata } = this.parseAIResponse(response.data);
    
    console.log('=== PARSED HTML ===');
    console.log('HTML length:', htmlContent?.length);
    console.log('First 500 chars of HTML:', htmlContent?.substring(0, 500));

    return {
      htmlContent,
      metadata: metadata || {
        tools: [],
        primaryAction: 'workspace_generated'
      },
      interactions: []
    };
  }

  /**
   * Build a comprehensive prompt for workspace generation
   * This incorporates learnings from gemini-os's system prompts
   */
  private buildPrompt(intent: string): string {
    const historyContext = this.buildHistoryContext();
    
    return `${WORKSPACE_SYSTEM_PROMPT}

User Intent: "${intent}"

${historyContext}

Generate a complete HTML workspace that:
1. Addresses the user's intent directly
2. Creates fully functional, interactive interfaces
3. Has interactive elements with data-interaction-id attributes
4. Uses the workspace CSS classes for consistent styling
5. Embeds any necessary JavaScript for interactivity

Remember to:
- Use iframes for embedding websites (Google, GitHub, etc.)
- Add search functionality where appropriate
- Include multiple tools if the task requires it
- Make the workspace immediately actionable

Output the HTML content only, no markdown or explanations.`;
  }

  /**
   * Build context from interaction history
   */
  private buildHistoryContext(): string {
    if (this.interactionHistory.length === 0) {
      return 'No previous interactions.';
    }

    const recentInteractions = this.interactionHistory
      .slice(0, 5)
      .map((interaction, index) => {
        return `${index + 1}. ${interaction.type}: "${interaction.elementText}" (${interaction.id})`;
      })
      .join('\n');

    return `Recent Interactions:
${recentInteractions}`;
  }

  /**
   * Parse AI response to extract HTML and metadata
   */
  private parseAIResponse(data: string): { htmlContent: string; metadata?: any } {
    // If the response includes metadata markers, extract them
    const metadataMatch = data.match(/<!-- METADATA: (.*?) -->/s);
    let metadata = {};
    let htmlContent = data;

    if (metadataMatch) {
      try {
        metadata = JSON.parse(metadataMatch[1]);
        htmlContent = data.replace(metadataMatch[0], '');
      } catch (e) {
        console.warn('Failed to parse metadata from AI response');
      }
    }

    return { htmlContent: htmlContent.trim(), metadata };
  }

  /**
   * Generate a fallback workspace for error cases
   */
  private generateFallbackWorkspace(intent: string): WorkspaceGenerationResult {
    const htmlContent = `
      <div class="workspace-container">
        <div class="workspace-header">
          <h2 class="workspace-title">Workspace for: ${this.escapeHtml(intent)}</h2>
        </div>
        <div class="workspace-content">
          <div class="quick-actions">
            <button class="action-button" data-interaction-id="google-search" data-interaction-type="open-tool">
              🔍 Google Search
            </button>
            <button class="action-button" data-interaction-id="open-docs" data-interaction-type="open-tool">
              📝 Google Docs
            </button>
            <button class="action-button" data-interaction-id="open-github" data-interaction-type="open-tool">
              💻 GitHub
            </button>
          </div>
          <div class="workspace-main">
            <iframe 
              src="https://www.google.com/search?igu=1&source=hp&ei=&iflsig=&output=embed" 
              class="main-iframe"
              title="Google Search"
            ></iframe>
          </div>
        </div>
      </div>
    `;

    return {
      htmlContent,
      metadata: {
        tools: ['google-search'],
        primaryAction: 'fallback_workspace'
      },
      interactions: []
    };
  }

  /**
   * Build contextual intent from interaction
   */
  private buildContextualIntent(interaction: InteractionData): string {
    const baseIntent = `Continue from interaction: ${interaction.type} on ${interaction.elementText}`;
    
    if (interaction.value) {
      return `${baseIntent} with value: ${interaction.value}`;
    }
    
    return baseIntent;
  }

  /**
   * Generate cache key for intent
   */
  private generateCacheKey(intent: string): string {
    // Include recent interaction context in cache key
    const contextHash = this.interactionHistory
      .slice(0, 3)
      .map(i => i.id)
      .join('-');
    
    return `${intent.toLowerCase().replace(/\s+/g, '_')}_${contextHash}`;
  }

  /**
   * Escape HTML for safe rendering
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Clear workspace cache
   */
  clearCache(): void {
    this.workspaceCache.clear();
  }

  /**
   * Clear interaction history
   */
  clearHistory(): void {
    this.interactionHistory = [];
  }

  /**
   * Get current interaction history
   */
  getHistory(): InteractionData[] {
    return [...this.interactionHistory];
  }
}

// Export singleton instance
export const workspaceGenerator = new DynamicWorkspaceGenerator();