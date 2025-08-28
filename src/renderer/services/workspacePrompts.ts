/**
 * Workspace Generation Prompts
 * Comprehensive system prompts and tool definitions for dynamic workspace generation
 * Inspired by gemini-os's detailed prompt engineering
 */

export const WORKSPACE_SYSTEM_PROMPT = `
**Role:**
You are an AI that generates interactive HTML interfaces based on user intent. Your goal is to create complete, functional content areas that respond to user interactions.

**Core Principles:**
1. Generate ONLY HTML content - no explanations or markdown
2. Create fully functional, interactive interfaces
3. Use real data and working examples, never placeholders
4. Every element should be immediately actionable

**HTML Output Requirements:**

1. **Structure:** 
   - Your response MUST be ONLY HTML for the content area
   - DO NOT include \`\`\`html, \`\`\`, <html>, <body>, or outer container elements
   - DO NOT add markdown formatting or explanations
   - Include <style> tags for custom styling when needed

2. **CSS Classes:**
   - Text: class="workspace-text"
   - Buttons: class="workspace-button"
   - Inputs: class="workspace-input"
   - Containers: class="workspace-container", class="workspace-panel"
   - Visual effects: class="glass-panel", class="dark-theme"

3. **Interactivity (TWO TYPES - CRITICAL TO UNDERSTAND):**
   
   **Type A: Workspace Regeneration (New Task/Context)**
   Use these data attributes ONLY for actions that need a completely new workspace:
   - data-interaction-id="unique_descriptive_id" (e.g., "new_task_calculator", "switch_to_email")
   - data-interaction-type="workspace_change" (ONLY use this specific value for workspace changes)
   - For inputs: data-value-from="input_id"
   
   Examples that need workspace regeneration:
   - "Switch to email composer"
   - "Open a different tool"
   - "Start new task"
   - Major context switches
   
   **Type B: Local Actions (Same Workspace)**
   DO NOT add data-interaction attributes for these. Instead, use inline JavaScript:
   - Calculator buttons → onclick handlers that update display
   - Tab switches → JavaScript to show/hide content
   - Form validation → JavaScript validation
   - Iframe navigation → JavaScript to change src
   - Any UI state change within the same tool
   
   Example of local action (calculator button):
   <button class="workspace-button" onclick="updateDisplay('7')">7</button>
   
   Example of workspace regeneration (switching tools):
   <button class="workspace-button" data-interaction-id="open_email" data-interaction-type="workspace_change">
     Switch to Email
   </button>

4. **Iframe Embedding:**
   Use iframes to embed real tools and websites:
   - Set appropriate sandbox attributes for security
   - Use allow attributes for necessary permissions
   - Always set width/height or use CSS for responsive sizing

5. **JavaScript (ESSENTIAL for Local Actions):**
   Include inline <script> tags for ALL local interactivity:
   - Use modern ES6+ JavaScript
   - Handle ALL button clicks, form submissions that don't need new workspaces
   - Implement real-time features (timers, calculations, state updates)
   - Manage UI state changes (tabs, accordions, modals)
   - Update iframe sources dynamically
   - Handle keyboard shortcuts
   
   CRITICAL: Most user interactions should be handled locally with JavaScript.
   Only use data-interaction-type="workspace_change" for major context switches.

**Content Types You Can Generate:**

1. **Web Browsing:**
   - Google Search: src="https://www.google.com/search?igu=1&output=embed"
   - With query: src="https://www.google.com/search?q=QUERY&igu=1&output=embed"
   - Other sites via iframe when appropriate

2. **Interactive Tools:**
   - Calculators with real computation
   - Forms with validation
   - Data visualizations
   - File explorers

3. **Games:**
   - Self-contained HTML5 games
   - Use <canvas> with inline JavaScript
   - Include keyboard/mouse controls
   - Examples: Tic-Tac-Toe, Snake, Tetris

4. **Productivity Interfaces:**
   - Note-taking with save functionality
   - Todo lists with checkboxes
   - Timers and clocks
   - Settings panels

**Special Instructions for Complex Content:**

5. **For embedded content:**
   - Use iframes sparingly and only when necessary
   - Google Maps: src="https://www.google.com/maps?q=LOCATION&output=embed"
   - Ensure proper sandbox and allow attributes

6. **JavaScript in generated content:**
   - Wrap in <script> tags
   - Use IIFE pattern to avoid scope pollution
   - Focus on user interaction and dynamic updates
   - Example: (function() { /* game or interactive logic */ })()

7. **Context awareness:**
   - Adapt content based on user's interaction history
   - Maintain consistency with previous interactions
   - Generate unique IDs that describe their function

Remember: Generate complete, functional HTML that works immediately. No placeholders, no "coming soon", no mock data - everything should be real and interactive.`;

// CSS styles inspired by gemini-os styling approach
export const WORKSPACE_CSS = `
<style>
  /* Gemini-OS inspired styling */
  /* Default text color for all workspace content */
  body, div, p, h1, h2, h3, h4, h5, h6, span, label {
    color: #333 !important;
  }
  
  .workspace-text {
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    margin: 8px 0;
  }
  
  .workspace-button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 4px;
    box-shadow: 0 2px 8px rgba(255, 140, 66, 0.25);
  }
  
  .workspace-button:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #FF9652 0%, #FF7A45 100%);
    box-shadow: 0 4px 12px rgba(255, 140, 66, 0.4);
  }
  
  .workspace-button:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(255, 140, 66, 0.3);
  }
  
  .workspace-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    color: #333;
  }
  
  .workspace-input:focus {
    outline: none;
    border-color: #FF8C42;
    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
  }
  
  .workspace-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 12px;
  }
  
  .workspace-panel {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    margin-bottom: 16px;
  }
  
  .glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  }
  
  .dark-theme {
    background: #1a1a2e;
    color: #eee !important;
  }
  
  .dark-theme * {
    color: #eee !important;
  }
  
  .dark-theme .workspace-panel {
    background: rgba(255, 255, 255, 0.05);
    color: #eee !important;
  }
  
  /* Game canvas styling */
  canvas {
    display: block;
    margin: 20px auto;
    border: 2px solid #333;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  /* Icons and emojis */
  .icon {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    margin: 8px;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .icon:hover {
    transform: scale(1.1);
  }
  
  .icon-image {
    font-size: 32px;
    margin-bottom: 4px;
  }
  
  .icon-label {
    font-size: 12px;
    color: #666;
  }
</style>
`;

// Example HTML templates for different workspace types
export const EXAMPLE_WORKSPACES = {
  search: `
    <div class="workspace-container">
      <div class="workspace-panel">
        <h2>Multi-Search</h2>
        <input type="text" id="search-query" class="workspace-input" placeholder="Enter search query...">
        <!-- Local actions - no data-interaction attributes -->
        <button class="workspace-button" onclick="searchGoogle()">
          Search Google
        </button>
        <button class="workspace-button" onclick="searchBing()">
          Search Bing
        </button>
        <!-- Workspace change - has data-interaction attributes -->
        <button class="workspace-button" data-interaction-id="open_calculator" data-interaction-type="workspace_change">
          Switch to Calculator
        </button>
      </div>
      <iframe id="search-frame" src="https://www.google.com/search?igu=1&output=embed" style="width: 100%; height: 500px; border: none; border-radius: 8px;"></iframe>
    </div>
    <script>
      function searchGoogle() {
        const query = document.getElementById('search-query').value;
        document.getElementById('search-frame').src = 'https://www.google.com/search?q=' + encodeURIComponent(query) + '&igu=1&output=embed';
      }
      function searchBing() {
        const query = document.getElementById('search-query').value;
        // Note: Bing doesn't have an embeddable search, so we use Google with site:bing.com
        document.getElementById('search-frame').src = 'https://www.google.com/search?q=site:bing.com+' + encodeURIComponent(query) + '&igu=1&output=embed';
      }
    </script>
  `,
  
  calculator: `
    <div class="workspace-panel">
      <h2>Calculator</h2>
      <input type="text" id="calc-display" class="workspace-input" readonly value="0">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
        <!-- Local actions only - no data-interaction attributes needed -->
        <button class="workspace-button" onclick="calcButton('7')">7</button>
        <button class="workspace-button" onclick="calcButton('8')">8</button>
        <button class="workspace-button" onclick="calcButton('9')">9</button>
        <button class="workspace-button" onclick="calcButton('/')">÷</button>
        <button class="workspace-button" onclick="calcButton('4')">4</button>
        <button class="workspace-button" onclick="calcButton('5')">5</button>
        <button class="workspace-button" onclick="calcButton('6')">6</button>
        <button class="workspace-button" onclick="calcButton('*')">×</button>
        <button class="workspace-button" onclick="calcButton('1')">1</button>
        <button class="workspace-button" onclick="calcButton('2')">2</button>
        <button class="workspace-button" onclick="calcButton('3')">3</button>
        <button class="workspace-button" onclick="calcButton('-')">-</button>
        <button class="workspace-button" onclick="calcButton('0')">0</button>
        <button class="workspace-button" onclick="calcButton('.')">.</button>
        <button class="workspace-button" onclick="calcButton('=')">=</button>
        <button class="workspace-button" onclick="calcButton('+')">+</button>
      </div>
      <script>
        let display = document.getElementById('calc-display');
        let currentValue = '0';
        let previousValue = '';
        let operation = null;
        
        window.calcButton = function(action) {
          if (!isNaN(action) || action === '.') {
            if (currentValue === '0' && action !== '.') {
              currentValue = action;
            } else if (action === '.' && !currentValue.includes('.')) {
              currentValue += action;
            } else if (action !== '.') {
              currentValue = currentValue === '0' ? action : currentValue + action;
            }
            display.value = currentValue;
          } else if (action === '=') {
            if (operation && previousValue) {
              const prev = parseFloat(previousValue);
              const curr = parseFloat(currentValue);
              let result = 0;
              
              switch(operation) {
                case '+': result = prev + curr; break;
                case '-': result = prev - curr; break;
                case '*': result = prev * curr; break;
                case '/': result = prev / curr; break;
              }
              
              currentValue = result.toString();
              display.value = currentValue;
              operation = null;
              previousValue = '';
            }
          } else {
            // It's an operation (+, -, *, /)
            operation = action;
            previousValue = currentValue;
            currentValue = '0';
          }
        };
      </script>
    </div>
  `
};