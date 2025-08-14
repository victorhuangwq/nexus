/**
 * Workspace Generation Prompts
 * Comprehensive system prompts and tool definitions for dynamic workspace generation
 * Inspired by gemini-os's detailed prompt engineering
 */

export const WORKSPACE_SYSTEM_PROMPT = `
**Role:**
You are Nexus, an AI workspace generator that creates complete, interactive HTML workspaces to help users get work done efficiently. You generate production-ready interfaces with embedded tools, websites, and interactive elements.

**Core Principles:**
1. Generate complete, functional HTML that accomplishes the user's task
2. Embed real websites and tools using iframes when needed
3. Create multi-tool workspaces for complex tasks
4. Make everything immediately actionable - no placeholders

**HTML Generation Rules:**

1. **Structure:** 
   - Output ONLY raw HTML content for the workspace area
   - NO markdown, NO code blocks, NO explanations
   - NO <html>, <body>, or outer container tags
   - Include <style> tags for custom workspace styling when needed

2. **Styling Classes:**
   - Containers: workspace-container, tool-panel, split-view, grid-layout
   - Interactive: action-button, search-input, tool-selector
   - Layout: main-content, sidebar, toolbar, status-bar
   - Visual: glass-panel, dark-theme, accent-border

3. **Interactive Elements:**
   ALL interactive elements MUST have:
   - data-interaction-id="unique_descriptive_id"
   - data-interaction-type="action_type"
   - For inputs with buttons: data-value-from="input_id"

4. **Iframe Embedding:**
   Use iframes to embed real tools and websites:
   - Set appropriate sandbox attributes for security
   - Use allow attributes for necessary permissions
   - Always set width/height or use CSS for responsive sizing

5. **JavaScript:**
   Include inline <script> tags for dynamic functionality:
   - Use modern ES6+ JavaScript
   - Add event listeners for interactions
   - Implement real-time features (timers, calculations, etc.)
   - Handle keyboard shortcuts for power users

**Workspace Patterns:**

1. **Research Workspace:**
   - Split view with search and results
   - Multiple search engines/sources
   - Note-taking area
   - Quick bookmarking

2. **Writing Workspace:**
   - Document editor (Google Docs iframe)
   - Research panel (Wikipedia, references)
   - Grammar/style checker
   - Export options

3. **Coding Workspace:**
   - Code editor or GitHub
   - Documentation viewer
   - Terminal/console mockup
   - Stack Overflow search

4. **Planning Workspace:**
   - Calendar view
   - Task lists
   - Time tracking
   - Project overview

5. **Communication Workspace:**
   - Email interface (Gmail iframe)
   - Chat/messaging area
   - Contact management
   - Draft composer

6. **Analysis Workspace:**
   - Data visualization
   - Spreadsheet (Google Sheets iframe)
   - Calculator/converter tools
   - Comparison tables

**Special Instructions:**

- When user asks to search: Create a multi-search interface with Google, Bing, DuckDuckGo
- When user mentions email: Embed Gmail or create email composer
- When user needs documents: Embed Google Docs/Sheets
- When user mentions code: Include GitHub, CodePen, or code editors
- When user needs calculations: Create interactive calculators
- When user mentions travel: Embed maps, flight searches, hotel booking
- When user needs shopping: Create price comparison, review aggregator

Remember: The goal is to create a complete workspace that allows the user to accomplish their task without leaving the interface.`;

export const PRODUCTIVITY_TOOLS = {
  search: {
    google: {
      name: "Google Search",
      embedUrl: "https://www.google.com/search?igu=1&source=hp&ei=&iflsig=&output=embed",
      searchParam: "q",
      icon: "🔍"
    },
    bing: {
      name: "Bing",
      embedUrl: "https://www.bing.com",
      searchParam: "q",
      icon: "🔎"
    },
    duckduckgo: {
      name: "DuckDuckGo",
      embedUrl: "https://duckduckgo.com",
      searchParam: "q",
      icon: "🦆"
    },
    wikipedia: {
      name: "Wikipedia",
      embedUrl: "https://en.wikipedia.org",
      searchPath: "/wiki/",
      icon: "📚"
    }
  },
  
  productivity: {
    googleDocs: {
      name: "Google Docs",
      embedUrl: "https://docs.google.com",
      icon: "📝"
    },
    googleSheets: {
      name: "Google Sheets",
      embedUrl: "https://sheets.google.com",
      icon: "📊"
    },
    googleSlides: {
      name: "Google Slides",
      embedUrl: "https://slides.google.com",
      icon: "📰"
    },
    gmail: {
      name: "Gmail",
      embedUrl: "https://mail.google.com",
      icon: "📧"
    },
    googleCalendar: {
      name: "Google Calendar",
      embedUrl: "https://calendar.google.com",
      icon: "📅"
    },
    googleKeep: {
      name: "Google Keep",
      embedUrl: "https://keep.google.com",
      icon: "📌"
    }
  },
  
  development: {
    github: {
      name: "GitHub",
      embedUrl: "https://github.com",
      icon: "💻"
    },
    stackoverflow: {
      name: "Stack Overflow",
      embedUrl: "https://stackoverflow.com",
      searchParam: "q",
      icon: "💡"
    },
    codepen: {
      name: "CodePen",
      embedUrl: "https://codepen.io",
      icon: "✏️"
    },
    codesandbox: {
      name: "CodeSandbox",
      embedUrl: "https://codesandbox.io",
      icon: "📦"
    },
    jsbin: {
      name: "JS Bin",
      embedUrl: "https://jsbin.com",
      icon: "🔧"
    }
  },
  
  communication: {
    gmail: {
      name: "Gmail",
      embedUrl: "https://mail.google.com",
      icon: "📧"
    },
    slack: {
      name: "Slack",
      embedUrl: "https://app.slack.com",
      icon: "💬"
    },
    discord: {
      name: "Discord",
      embedUrl: "https://discord.com/app",
      icon: "🎮"
    },
    teams: {
      name: "Microsoft Teams",
      embedUrl: "https://teams.microsoft.com",
      icon: "👥"
    }
  },
  
  media: {
    youtube: {
      name: "YouTube",
      embedUrl: "https://www.youtube.com",
      searchParam: "search_query",
      icon: "📺"
    },
    spotify: {
      name: "Spotify",
      embedUrl: "https://open.spotify.com",
      icon: "🎵"
    },
    soundcloud: {
      name: "SoundCloud",
      embedUrl: "https://soundcloud.com",
      icon: "🎧"
    }
  },
  
  finance: {
    googleFinance: {
      name: "Google Finance",
      embedUrl: "https://www.google.com/finance",
      icon: "📈"
    },
    yahoo: {
      name: "Yahoo Finance",
      embedUrl: "https://finance.yahoo.com",
      icon: "💹"
    },
    tradingview: {
      name: "TradingView",
      embedUrl: "https://www.tradingview.com",
      icon: "📊"
    }
  },
  
  maps: {
    googleMaps: {
      name: "Google Maps",
      embedUrl: "https://www.google.com/maps",
      embedParam: "output=embed",
      searchParam: "q",
      icon: "🗺️"
    },
    openstreetmap: {
      name: "OpenStreetMap",
      embedUrl: "https://www.openstreetmap.org",
      icon: "🌍"
    }
  },
  
  shopping: {
    amazon: {
      name: "Amazon",
      embedUrl: "https://www.amazon.com",
      searchParam: "s?k=",
      icon: "🛒"
    },
    ebay: {
      name: "eBay",
      embedUrl: "https://www.ebay.com",
      searchParam: "sch/i.html?_nkw=",
      icon: "🏪"
    }
  },
  
  reference: {
    wolfram: {
      name: "Wolfram Alpha",
      embedUrl: "https://www.wolframalpha.com",
      searchParam: "input",
      icon: "🧮"
    },
    arxiv: {
      name: "arXiv",
      embedUrl: "https://arxiv.org",
      searchPath: "/search/?query=",
      icon: "📄"
    },
    pubmed: {
      name: "PubMed",
      embedUrl: "https://pubmed.ncbi.nlm.nih.gov",
      searchParam: "term",
      icon: "🔬"
    }
  },
  
  social: {
    twitter: {
      name: "Twitter/X",
      embedUrl: "https://twitter.com",
      icon: "🐦"
    },
    linkedin: {
      name: "LinkedIn",
      embedUrl: "https://www.linkedin.com",
      icon: "💼"
    },
    reddit: {
      name: "Reddit",
      embedUrl: "https://www.reddit.com",
      icon: "🔶"
    }
  },
  
  ai: {
    chatgpt: {
      name: "ChatGPT",
      embedUrl: "https://chat.openai.com",
      icon: "🤖"
    },
    claude: {
      name: "Claude",
      embedUrl: "https://claude.ai",
      icon: "🧠"
    },
    perplexity: {
      name: "Perplexity",
      embedUrl: "https://www.perplexity.ai",
      icon: "🔮"
    }
  }
};

export const WORKSPACE_CSS = `
<style>
  .workspace-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .workspace-header {
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .workspace-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .workspace-content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  
  .split-view {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 16px;
    width: 100%;
  }
  
  .tool-panel {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  
  .main-iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 8px;
    background: white;
  }
  
  .action-button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #4ecdc4 0%, #44a3aa 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 4px;
  }
  
  .action-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
  }
  
  .search-input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    margin-bottom: 12px;
  }
  
  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
    padding: 16px;
    width: 100%;
    height: 100%;
  }
  
  .sidebar {
    width: 280px;
    background: rgba(255, 255, 255, 0.03);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px;
    overflow-y: auto;
  }
  
  .main-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }
  
  .glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
  }
  
  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .status-bar {
    padding: 8px 16px;
    background: rgba(78, 205, 196, 0.1);
    border-top: 1px solid rgba(78, 205, 196, 0.3);
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .tab-container {
    display: flex;
    gap: 4px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px 8px 0 0;
  }
  
  .tab {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease;
  }
  
  .tab.active {
    background: rgba(78, 205, 196, 0.2);
    border-color: rgba(78, 205, 196, 0.4);
  }
  
  .tab:hover {
    background: rgba(255, 255, 255, 0.08);
  }
</style>
`;

export const EXAMPLE_WORKSPACES = {
  research: `
    <div class="split-view">
      <div class="tool-panel">
        <input type="text" id="search-query" class="search-input" placeholder="Enter search query...">
        <button class="action-button" data-interaction-id="search-all" data-value-from="search-query">
          Search All
        </button>
        <iframe src="https://www.google.com/search?igu=1&output=embed" class="main-iframe"></iframe>
      </div>
      <div class="tool-panel">
        <h3>Notes</h3>
        <textarea id="notes" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px; border-radius: 8px;"></textarea>
      </div>
    </div>
  `,
  
  coding: `
    <div class="workspace-container">
      <div class="quick-actions">
        <button class="action-button" data-interaction-id="open-github">GitHub</button>
        <button class="action-button" data-interaction-id="open-stackoverflow">Stack Overflow</button>
        <button class="action-button" data-interaction-id="open-codepen">CodePen</button>
      </div>
      <div class="split-view">
        <iframe src="https://github.com" class="main-iframe"></iframe>
        <iframe src="https://stackoverflow.com" class="main-iframe"></iframe>
      </div>
    </div>
  `
};