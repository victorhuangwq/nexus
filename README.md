# IntentOS

> An AI-powered desktop app that instantly creates micro-tools from natural language descriptions.

IntentOS transforms simple text descriptions into fully functional interfaces. Type "calculator" and get a graphing calculator. Type "tokyo trip" and get a complete travel itinerary. It's designed to be the fastest way to get exactly what you need, when you need it.

![IntentOS Demo](https://via.placeholder.com/800x500/FAFAFA/0EA5E9?text=IntentOS+Demo)

## ✨ Demo-Ready Features

### 🧮 **Calculator**
- **Trigger**: "calculator", "graphing calculator", "math", "equations"
- **What you get**: Full Desmos graphing calculator with tips
- **Demo script**: Type "calculator" → Instant mathematical graphing tool

### 🗾 **Tokyo Trip Planner**  
- **Trigger**: "tokyo trip", "japan travel", "tokyo itinerary"
- **What you get**: 3-day itinerary with interactive Google Maps, live weather widget, JR Pass calculator, and currency converter
- **Demo script**: Type "tokyo trip" → Complete travel planning with embedded tools

### ₿ **Bitcoin Chart**
- **Trigger**: "bitcoin", "btc", "crypto", "bitcoin chart"
- **What you get**: Live price chart with market data and timeframe controls
- **Demo script**: Type "bitcoin" → Real-time cryptocurrency tracker

### 🌤️ **Weather Widget**
- **Trigger**: "weather", "forecast", "temperature"
- **What you get**: Live weather data for any city with quick city buttons and unit conversion
- **Demo script**: Type "weather" → Interactive weather tool

### 🎯 **Smart Intent Matching**
- **70%+ confidence threshold** for instant static component loading
- **Keyword, phrase, and alias recognition** 
- **Fallback to AI generation** for unrecognized requests
- **Debug info** showing match confidence (⌥ + D)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- macOS or Windows

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd squash-os

# Install dependencies
npm install

# Add your Anthropic API key
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=your_key_here

# Start development
npm run dev
```

The app will open in a new Electron window with the IntentOS interface.

## 🎬 Demo Instructions

### For Investors/Stakeholders
1. **Launch**: `npm run dev`
2. **Calculator Demo**: Type "calculator" → Show mathematical graphing with Desmos
3. **Travel Demo**: Type "tokyo trip" → Show complete itinerary with maps, weather, currency tools
4. **Crypto Demo**: Type "bitcoin" → Show live market data and charts
5. **Weather Demo**: Type "weather" → Show interactive weather for any city
6. **AI Fallback**: Type "machine learning" → Show AI processing message
7. **Debug Info**: Press ⌥ + D → Show technical details

### Key Demo Points
- **Instant Response**: Static components load in <100ms
- **Natural Language**: No need to learn commands or syntax
- **Professional UI**: Clean, Apple-inspired design
- **Multiple Domains**: Math, travel, finance, weather, and more coming
- **Mixed Online/Local**: Combines embedded web tools with native UI
- **Extensible**: Easy to add new components and capabilities

## 🏗️ Technical Architecture

### Stack
- **Frontend**: React 18 + TypeScript + Chakra UI
- **Desktop**: Electron with secure IPC
- **Build**: Vite for fast development and optimized builds
- **AI**: Anthropic Claude 4.0 API integration
- **Charts**: Recharts for data visualization
- **Animation**: Framer Motion for smooth transitions

### Key Files
```
src/
├── main.ts                 # Electron main process
├── preload.ts             # Secure IPC bridge
└── renderer/
    ├── App.tsx            # Main React application
    ├── components/
    │   ├── OmniPrompt.tsx # Main input interface
    │   ├── DevHUD.tsx     # Debug information
    │   └── static/        # Demo-ready components
    │       ├── GraphingCalculator.tsx
    │       ├── TokyoTrip.tsx
    │       ├── BTCChart.tsx
    │       └── WeatherWidget.tsx
    ├── utils/
    │   └── intentMatcher.ts # Smart intent recognition
    └── theme.ts           # Design system
```

## 🎯 Current Status

### ✅ Phase 1: Electron Shell (Complete)
- Electron main process with secure IPC
- Environment variable loading
- Development hot-reload

### ✅ Phase 2: React + Chakra UI (Complete)  
- Modern light-mode interface
- Apple-inspired clean design
- Responsive glassmorphism effects

### ✅ Phase 3: Static Components (Complete)
- Calculator with Desmos integration
- Tokyo trip planner with Google Maps, weather, JR Pass calculator, currency converter
- Bitcoin chart with live data and market stats
- Weather widget with city search and live forecasts
- Smart intent matching system

### 🚧 Phase 4: Claude Integration (Next)
- Dynamic component generation
- Advanced AI prompt engineering
- Component caching system

### 🚧 Phase 5: Production Polish (Future)
- Signed builds for distribution
- Telemetry and analytics
- Auto-updater system

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development with hot reload
npm run build        # Build for production
npm run test         # Run test suite
npm run electron:pack # Package for distribution
```

### Adding New Static Components
1. Create component in `src/renderer/components/static/`
2. Add intent patterns to `src/renderer/utils/intentMatcher.ts`
3. Import and render in `src/renderer/App.tsx`

### Testing
```bash
# Run component tests
npm test

# Manual testing
npm run dev
# Type: calculator, tokyo trip, bitcoin, weather
# Press ⌥ + D for debug information
```

## 📊 Performance

- **Static Component Load**: <100ms
- **App Startup**: ~2s cold start
- **Bundle Size**: ~800KB (includes charts, animations)
- **Memory Usage**: ~150MB average

## 🎨 Design System

### Colors
- **Primary**: iOS Blue (#0EA5E9)
- **Accents**: Purple, Pink, Emerald, Amber
- **Background**: Light gradient (#FAFAFA → #F0F9FF)

### Typography
- **Font**: Inter (system fallback)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold)

### Components
- **Glassmorphism**: Subtle blur effects with transparency
- **Animations**: Minimal, purposeful motion
- **Layout**: Centered, focused design

## 🤝 Contributing

This is currently a demo/prototype project. For production use:

1. Add proper error handling
2. Implement user authentication  
3. Add component sandboxing
4. Create component marketplace
5. Add offline capability

## 📝 License

[Add your license here]

---

**Built for instant productivity. Powered by AI. Designed for humans.**