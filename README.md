# Nexus

An AI-powered desktop app that instantly creates micro-tools from text descriptions.

## Quick Start

```bash
# Clone and install
git clone <repository-url>
cd nexus
npm install

# Setup API key
cp .env.example .env
# Add: ANTHROPIC_API_KEY=your_key_here

# Run
npm run dev
```

## Demo Examples

Type these to see instant tools:
- **"calculator"** → Graphing calculator
- **"tokyo trip"** → Travel planner with maps
- **"bitcoin"** → Live crypto charts
- **"weather"** → Weather widget

## Development

```bash
npm run dev          # Start development
npm run build        # Build for production
npm test             # Run tests
```

## Tech Stack

- **Desktop**: Electron
- **UI**: React + TypeScript + Chakra UI
- **AI**: Anthropic Claude API
- **Build**: Vite

## License

[Add your license here]