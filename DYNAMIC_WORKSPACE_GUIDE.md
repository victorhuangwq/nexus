# Dynamic Workspace Generation - Nexus

## Overview

Nexus now incorporates a powerful dynamic workspace generation system inspired by gemini-os's approach to creating interactive HTML interfaces. This system allows Nexus to generate complete, functional workspaces on-the-fly based on user intent.

## Key Features

### 1. **Direct HTML Generation**
- AI generates complete HTML workspaces with embedded iframes, tools, and interactive elements
- No need for pre-defined templates for work-focused tasks
- Supports inline JavaScript for dynamic functionality

### 2. **Productivity Tool Integration**
- Automatic embedding of productivity tools via iframes:
  - Google Workspace (Docs, Sheets, Gmail, Calendar)
  - Development tools (GitHub, Stack Overflow, CodePen)
  - Search engines (Google, Bing, DuckDuckGo)
  - Communication platforms (Slack, Discord, Teams)
  - And many more...

### 3. **Interaction Tracking**
- Every interactive element has a unique `data-interaction-id`
- System tracks user interactions to refine subsequent workspace generation
- Maintains history for context-aware improvements

### 4. **Smart Intent Detection**
When you type a work-related query, Nexus automatically:
- Recognizes productivity intent (email, research, coding, planning, etc.)
- Generates appropriate workspace with relevant tools
- Creates multi-tool layouts for complex tasks

## How to Use

### Basic Usage

1. **Work-focused queries** trigger dynamic workspace generation:
   - "Research climate change and take notes"
   - "Write an email to the team about the project update"
   - "Compare prices for laptops on different sites"
   - "Plan a marketing campaign with timeline"
   - "Code a React component with documentation"

2. **Existing functionality** remains for other queries:
   - Math/science queries → Static components
   - General queries → AI-powered layouts

### Example Workspaces

#### Research Workspace
Query: "Research AI trends for 2024"
- Split view with multiple search engines
- Note-taking area
- Quick bookmarking buttons
- Wikipedia sidebar

#### Email Workspace
Query: "Check my gmail and compose a newsletter"
- Gmail iframe
- Draft composer
- Contact list
- Template selector

#### Coding Workspace
Query: "Debug JavaScript code with Stack Overflow"
- GitHub repository viewer
- Stack Overflow search
- Code sandbox
- Documentation panel

## Technical Implementation

### Architecture

```
User Query → Intent Detection → Workspace Generator → HTML Generation → Rendering
                                         ↓
                              Interaction Tracking → Context Refinement
```

### Key Components

1. **DynamicWorkspaceGenerator.ts**
   - Main service for workspace generation
   - Manages interaction history and caching
   - Builds comprehensive prompts for AI

2. **GeneratedWorkspace.tsx**
   - React component for rendering HTML workspaces
   - Handles interaction events
   - Executes embedded scripts safely

3. **workspacePrompts.ts**
   - System prompts for AI generation
   - Tool definitions and embed URLs
   - CSS styling for workspaces

### Security Features

- Iframe sandboxing for embedded content
- URL validation for allowed domains
- Script sanitization
- Restricted to productivity-focused domains

## API Integration

The system can be extended with additional APIs:

### Search APIs
- Google Custom Search API (for programmatic search)
- Bing Search API
- DuckDuckGo Instant Answer API

### Productivity APIs
- Google Workspace APIs
- GitHub API
- Notion API
- Slack API

To add API keys, update your `.env` file:
```
GOOGLE_SEARCH_API_KEY=your_key_here
GITHUB_API_TOKEN=your_token_here
```

## Customization

### Adding New Tools

Edit `workspacePrompts.ts` to add new tools:

```typescript
export const PRODUCTIVITY_TOOLS = {
  yourCategory: {
    yourTool: {
      name: "Tool Name",
      embedUrl: "https://tool.com",
      icon: "🔧"
    }
  }
}
```

### Custom Workspace Patterns

Add new patterns to the system prompt:

```typescript
export const WORKSPACE_SYSTEM_PROMPT = `
...
7. **Your Custom Workspace:**
   - Define layout
   - Specify tools
   - Add interactions
...
`
```

## Performance Optimizations

- **Caching**: Generated workspaces are cached for faster recall
- **Lazy Loading**: Iframes load on-demand
- **History Limit**: Interaction history capped at 10 items
- **Fallback Generation**: Basic workspace if AI fails

## Troubleshooting

### Common Issues

1. **Iframe not loading**: Check if the domain is allowed in CSP
2. **Interactions not working**: Verify data-interaction-id attributes
3. **Slow generation**: Consider using cached workspaces
4. **API limits**: Implement rate limiting for Claude API calls

### Debug Mode

Press `Option + D` to open the Dev HUD and see:
- Workspace generation metrics
- Interaction history
- API response times
- Error logs

## Future Enhancements

- [ ] Workspace templates for common tasks
- [ ] Multi-window workspace layouts
- [ ] Persistent workspace sessions
- [ ] Collaborative workspaces
- [ ] Native app integrations
- [ ] Voice command support
- [ ] Workspace sharing/export

## Examples to Try

1. "Help me research and write a blog post about renewable energy"
2. "Set up a coding environment for Python development"
3. "Plan a product launch with timeline and tasks"
4. "Analyze stock market data and create a report"
5. "Manage my emails and calendar for the week"

Each query will generate a unique, tailored workspace with all the tools you need to complete the task efficiently.

## Credits

This implementation was inspired by the gemini-os project's approach to dynamic UI generation, adapted and enhanced for Nexus's productivity-focused mission.