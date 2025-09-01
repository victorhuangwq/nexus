/**
 * Workspace State Manager
 * Handles capturing and restoring state of interactive elements in workspaces
 */

export interface ElementState {
  elementId: string;
  selector: string;
  type: 'input' | 'checkbox' | 'radio' | 'select' | 'textarea' | 'scroll' | 'toggle';
  value?: string;
  checked?: boolean;
  selectedIndex?: number;
  scrollTop?: number;
  scrollLeft?: number;
  classList?: string[];
  customData?: Record<string, any>;
}

export interface WorkspaceSnapshot {
  workspaceId: string;
  timestamp: number;
  elements: ElementState[];
  scrollPositions: Record<string, { top: number; left: number }>;
  activeElement?: string;
  url?: string;
}

export class WorkspaceStateManager {
  private static instance: WorkspaceStateManager;
  private snapshots: Map<string, WorkspaceSnapshot> = new Map();
  private captureInterval: number | null = null;
  private currentWorkspaceId: string | null = null;
  private workspaceFrame: HTMLIFrameElement | null = null;

  static getInstance(): WorkspaceStateManager {
    if (!WorkspaceStateManager.instance) {
      WorkspaceStateManager.instance = new WorkspaceStateManager();
    }
    return WorkspaceStateManager.instance;
  }

  /**
   * Start capturing state for a workspace
   */
  startCapturing(workspaceId: string, frameOrContainer: HTMLIFrameElement | HTMLElement): void {
    this.currentWorkspaceId = workspaceId;
    
    // Handle both iframe and direct container
    if (frameOrContainer instanceof HTMLIFrameElement) {
      this.workspaceFrame = frameOrContainer;
    } else {
      // For direct containers, create a virtual frame reference
      this.workspaceFrame = {
        contentDocument: document,
        addEventListener: () => {},
        removeEventListener: () => {}
      } as HTMLIFrameElement;
    }
    
    // Clear any existing interval
    this.stopCapturing();
    
    // Start periodic snapshots (every 5 seconds)
    this.captureInterval = window.setInterval(() => {
      this.captureSnapshot();
    }, 5000);

    // Capture on important events
    this.setupEventListeners();
    
    // Initial snapshot after a delay to let content load
    setTimeout(() => {
      this.captureSnapshot();
    }, 1000);
  }

  /**
   * Stop capturing state
   */
  stopCapturing(): void {
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }
    
    // Take final snapshot before stopping
    if (this.currentWorkspaceId) {
      this.captureSnapshot();
    }
    
    this.removeEventListeners();
    this.currentWorkspaceId = null;
    this.workspaceFrame = null;
  }

  /**
   * Setup event listeners for immediate captures
   */
  private setupEventListeners(): void {
    // Capture on window blur (user switching away)
    window.addEventListener('blur', this.handleBlurCapture);
    
    // Capture before page unload
    window.addEventListener('beforeunload', this.handleUnloadCapture);
    
    // Capture on visibility change (tab switching)
    document.addEventListener('visibilitychange', this.handleVisibilityCapture);
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    window.removeEventListener('blur', this.handleBlurCapture);
    window.removeEventListener('beforeunload', this.handleUnloadCapture);
    document.removeEventListener('visibilitychange', this.handleVisibilityCapture);
  }

  private handleBlurCapture = (): void => {
    this.captureSnapshot();
  };

  private handleUnloadCapture = (): void => {
    this.captureSnapshot();
  };

  private handleVisibilityCapture = (): void => {
    if (document.hidden) {
      this.captureSnapshot();
    }
  };

  /**
   * Capture current state snapshot
   */
  captureSnapshot(): WorkspaceSnapshot | null {
    if (!this.currentWorkspaceId || !this.workspaceFrame) {
      return null;
    }

    try {
      const frameDoc = this.workspaceFrame.contentDocument;
      if (!frameDoc) {
        console.warn('Cannot access iframe document for state capture');
        return null;
      }

      const elements: ElementState[] = [];
      const scrollPositions: Record<string, { top: number; left: number }> = {};

      // Capture form inputs
      this.captureFormElements(frameDoc, elements);
      
      // Capture scroll positions
      this.captureScrollPositions(frameDoc, scrollPositions);
      
      // Capture active element
      const activeElement = frameDoc.activeElement?.id || 
                          this.generateElementId(frameDoc.activeElement);

      const snapshot: WorkspaceSnapshot = {
        workspaceId: this.currentWorkspaceId,
        timestamp: Date.now(),
        elements,
        scrollPositions,
        activeElement,
        url: frameDoc.location?.href
      };

      // Store snapshot
      this.snapshots.set(this.currentWorkspaceId, snapshot);
      
      console.log(`Captured state for workspace ${this.currentWorkspaceId}:`, {
        elements: elements.length,
        scrollPositions: Object.keys(scrollPositions).length
      });

      return snapshot;
    } catch (error) {
      console.error('Failed to capture workspace state:', error);
      return null;
    }
  }

  /**
   * Capture form elements state
   */
  private captureFormElements(doc: Document, elements: ElementState[]): void {
    // Text inputs, textareas, email, password, etc.
    const textInputs = doc.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], textarea');
    textInputs.forEach(el => {
      const input = el as HTMLInputElement | HTMLTextAreaElement;
      if (input.value) {
        elements.push({
          elementId: this.getElementId(input),
          selector: this.getElementSelector(input),
          type: input.tagName.toLowerCase() === 'textarea' ? 'textarea' : 'input',
          value: input.value
        });
      }
    });

    // Checkboxes and radios
    const checkboxes = doc.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checkboxes.forEach(el => {
      const input = el as HTMLInputElement;
      if (input.checked) {
        elements.push({
          elementId: this.getElementId(input),
          selector: this.getElementSelector(input),
          type: input.type as 'checkbox' | 'radio',
          checked: input.checked
        });
      }
    });

    // Select dropdowns
    const selects = doc.querySelectorAll('select');
    selects.forEach(el => {
      const select = el as HTMLSelectElement;
      if (select.selectedIndex > 0 || select.value) {
        elements.push({
          elementId: this.getElementId(select),
          selector: this.getElementSelector(select),
          type: 'select',
          selectedIndex: select.selectedIndex,
          value: select.value
        });
      }
    });

    // Custom interactive elements (elements with data-state attribute)
    const customElements = doc.querySelectorAll('[data-state]');
    customElements.forEach(el => {
      try {
        const customData = JSON.parse(el.getAttribute('data-state') || '{}');
        elements.push({
          elementId: this.getElementId(el),
          selector: this.getElementSelector(el),
          type: 'toggle',
          classList: Array.from(el.classList),
          customData
        });
      } catch (error) {
        console.warn('Invalid data-state JSON:', el.getAttribute('data-state'));
      }
    });
  }

  /**
   * Capture scroll positions
   */
  private captureScrollPositions(doc: Document, scrollPositions: Record<string, { top: number; left: number }>): void {
    // Document scroll
    if (doc.documentElement.scrollTop > 0 || doc.documentElement.scrollLeft > 0) {
      scrollPositions['document'] = {
        top: doc.documentElement.scrollTop,
        left: doc.documentElement.scrollLeft
      };
    }

    // Scrollable elements
    const scrollableElements = doc.querySelectorAll('*');
    scrollableElements.forEach(el => {
      const element = el as HTMLElement;
      if (element.scrollTop > 0 || element.scrollLeft > 0) {
        const id = this.getElementId(element);
        scrollPositions[id] = {
          top: element.scrollTop,
          left: element.scrollLeft
        };
      }
    });
  }

  /**
   * Restore state from snapshot
   */
  async restoreState(workspaceId: string, frame: HTMLIFrameElement): Promise<boolean> {
    const snapshot = this.snapshots.get(workspaceId);
    if (!snapshot) {
      console.log(`No state snapshot found for workspace ${workspaceId}`);
      return false;
    }

    try {
      // Wait for iframe to load
      await this.waitForFrameLoad(frame);
      
      const frameDoc = frame.contentDocument;
      if (!frameDoc) {
        console.error('Cannot access iframe document for state restoration');
        return false;
      }

      // Restore form elements
      this.restoreFormElements(frameDoc, snapshot.elements);
      
      // Restore scroll positions (with delay for layout)
      setTimeout(() => {
        this.restoreScrollPositions(frameDoc, snapshot.scrollPositions);
      }, 500);

      // Restore active element
      if (snapshot.activeElement) {
        setTimeout(() => {
          const activeEl = frameDoc.getElementById(snapshot.activeElement!) || 
                          frameDoc.querySelector(`[data-element-id="${snapshot.activeElement}"]`);
          if (activeEl && activeEl instanceof HTMLElement) {
            activeEl.focus();
          }
        }, 700);
      }

      console.log(`Restored state for workspace ${workspaceId}`);
      return true;
    } catch (error) {
      console.error('Failed to restore workspace state:', error);
      return false;
    }
  }

  /**
   * Wait for iframe to load
   */
  private waitForFrameLoad(frame: HTMLIFrameElement): Promise<void> {
    return new Promise((resolve) => {
      if (frame.contentDocument?.readyState === 'complete') {
        resolve();
      } else {
        frame.addEventListener('load', () => resolve(), { once: true });
        // Fallback timeout
        setTimeout(resolve, 2000);
      }
    });
  }

  /**
   * Restore form elements
   */
  private restoreFormElements(doc: Document, elements: ElementState[]): void {
    elements.forEach(elementState => {
      const element = this.findElement(doc, elementState);
      if (!element) return;

      try {
        switch (elementState.type) {
          case 'input':
          case 'textarea':
            if (elementState.value !== undefined) {
              (element as HTMLInputElement | HTMLTextAreaElement).value = elementState.value;
              // Trigger input event for frameworks that listen to it
              element.dispatchEvent(new Event('input', { bubbles: true }));
            }
            break;
            
          case 'checkbox':
          case 'radio':
            if (elementState.checked !== undefined) {
              (element as HTMLInputElement).checked = elementState.checked;
              element.dispatchEvent(new Event('change', { bubbles: true }));
            }
            break;
            
          case 'select':
            const select = element as HTMLSelectElement;
            if (elementState.selectedIndex !== undefined) {
              select.selectedIndex = elementState.selectedIndex;
            }
            if (elementState.value !== undefined) {
              select.value = elementState.value;
            }
            element.dispatchEvent(new Event('change', { bubbles: true }));
            break;
            
          case 'toggle':
            if (elementState.classList) {
              element.className = elementState.classList.join(' ');
            }
            if (elementState.customData) {
              element.setAttribute('data-state', JSON.stringify(elementState.customData));
            }
            break;
        }
      } catch (error) {
        console.warn('Failed to restore element state:', elementState, error);
      }
    });
  }

  /**
   * Restore scroll positions
   */
  private restoreScrollPositions(doc: Document, scrollPositions: Record<string, { top: number; left: number }>): void {
    Object.entries(scrollPositions).forEach(([elementId, position]) => {
      if (elementId === 'document') {
        doc.documentElement.scrollTop = position.top;
        doc.documentElement.scrollLeft = position.left;
      } else {
        const element = doc.getElementById(elementId) || 
                      doc.querySelector(`[data-element-id="${elementId}"]`);
        if (element instanceof HTMLElement) {
          element.scrollTop = position.top;
          element.scrollLeft = position.left;
        }
      }
    });
  }

  /**
   * Find element by ID or selector
   */
  private findElement(doc: Document, elementState: ElementState): Element | null {
    // Try by ID first
    let element = doc.getElementById(elementState.elementId);
    if (element) return element;

    // Try by data-element-id
    element = doc.querySelector(`[data-element-id="${elementState.elementId}"]`);
    if (element) return element;

    // Try by selector as fallback
    try {
      element = doc.querySelector(elementState.selector);
      return element;
    } catch (error) {
      console.warn('Invalid selector:', elementState.selector);
      return null;
    }
  }

  /**
   * Get or generate element ID
   */
  private getElementId(element: Element): string {
    if (element.id) return element.id;
    
    // Check for data-element-id
    const dataId = element.getAttribute('data-element-id');
    if (dataId) return dataId;
    
    // Generate and set ID
    const generated = this.generateElementId(element);
    element.setAttribute('data-element-id', generated);
    return generated;
  }

  /**
   * Generate unique element ID
   */
  private generateElementId(element: Element | null): string {
    if (!element) return `elem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? element.className.replace(/\s+/g, '_') : '';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4);
    
    return `${tagName}_${className}_${timestamp}_${random}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  /**
   * Get element selector
   */
  private getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const type = element.getAttribute('type');
    const name = element.getAttribute('name');
    
    let selector = tagName;
    if (type) selector += `[type="${type}"]`;
    if (name) selector += `[name="${name}"]`;
    if (className) selector += className;
    
    return selector;
  }

  /**
   * Get snapshot for workspace
   */
  getSnapshot(workspaceId: string): WorkspaceSnapshot | null {
    return this.snapshots.get(workspaceId) || null;
  }

  /**
   * Clear snapshots (for cleanup)
   */
  clearSnapshots(): void {
    this.snapshots.clear();
  }

  /**
   * Get all snapshots (for debugging)
   */
  getAllSnapshots(): WorkspaceSnapshot[] {
    return Array.from(this.snapshots.values());
  }
}

// Export singleton instance
export const workspaceStateManager = WorkspaceStateManager.getInstance();