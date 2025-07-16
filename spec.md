# IntentOS — Electron Demo Technical Specifications (v0.2)

> **Mission‑critical:** Investor‑ready desktop demo showing the “intent → instant micro‑app” magic loop. Runs on macOS & Windows via Electron. Same React bundle powers both the Chrome extension and the shell. This spec focuses on the **Electron shell**.

---

## 1 • High‑Level Architecture

| Layer                          | Tech                                              | Key Duties                                                                                                                              |
| ------------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Electron ‑ Main**            | TypeScript (`src/main.ts`)                        | Create BrowserWindow, store Claude key in OS keychain (`keytar`), wire IPC, auto‑update w/ `electron-updater`.                          |
| **Preload (context‑isolated)** | TS (`src/preload.ts`)                             | Safe `window.bridge` exposing:                                                                                                          |
| • `callClaude(type, payload)`  |                                                   |                                                                                                                                         |
| • `saveSchema(intent, schema)` |                                                   |                                                                                                                                         |
| • `logMetric(name, data)`      |                                                   |                                                                                                                                         |
| **Renderer**                   | React 18 + Vite + **Chakra UI** (dark neon theme) | 1) Render **OmniPrompt**. 2) Fetch/parse schema. 3) Dynamically `import()` Chakra JSX blocks. 4) Mount them with Framer Motion fade‑in. |
| **Model**                      | **Claude 4.0** (Anthropic API)                    | Step‑wise generation: **schema → components HTML → (optional) code logic snippets**.                                                    |
| **Storage**                    | IndexedDB (`dexie`)                               | Cache last 20 schemas & compiled components for offline demo.                                                                           |

### 1.1 Sequence Diagram (happy path)

1. **User** hits ⏎ in OmniPrompt.
2. **Renderer** → `ipc.callClaude('schema', intent)`
3. **Main** signs & sends HTTPS POST to Anthropic.
4. **Claude** returns `NodeSchema[]` (<=4 KB).
5. **Renderer** recursively requests `component` generation for each leaf node (batch streaming in parallel, max 6 concurrent).
6. Components compiled to `.tsx` with Chakra imports → written to `tmp/components/` via `fs` exposed by preload.
7. `dynamic()` import injects components; Motion variant animates in.
8. Metrics sent to PostHog.

---

## 2 • UI / UX Details

* **Aesthetic**: glassmorphism panels, backdrop blur (`backdropFilter`), accent color `#00E5FF`, font — Inter.
* **OmniPrompt**: `<InputGroup size="lg" w="50vw">` centered, shadow‑pulse on idle.
* **Generated view**: `<VStack spacing={6} maxW="75vw">` scrollable; persists until user clicks the logo to reset.
* **Dev HUD** (⌥ + D): opens right drawer displaying raw schema JSON & render timing.

---

## 3 • Claude Prompt Engineering

### 3.1 Schema Prompt Template

```text
SYSTEM: You are IntentOS‑Architect, outputting JSON only.
USER: Build a UI for "${intent}". Conform to this TS:
interface NodeSchema { id:string; type:"heading"|"text"|"image"|"video"|"iframe"|"product"|"calc"|"chart"; props:Record<string,any>; children?:NodeSchema[] }
Return compact NodeSchema[]. No prose.
```

### 3.2 Component Prompt Template

```text
SYSTEM: You are Chakra‑Generator. Output valid HTML/JSX only.
USER: Render component type ${type} with props ${JSON.stringify(props)}. Use Chakra syntax, no extra wrapper.
```

*Streaming (Claude v4 supports `anthropic‑version: 2025‑05‑30‑stream`). We buffer until `<END_OF_STREAM>` then compile.*

---

## 4 • Component Assembly Flow (Renderer)

```ts
const {schema} = await bridge.callClaude('schema', intent);
for (const node of flatten(schema)) {
  const {html} = await bridge.callClaude('component', node);
  await fs.writeFile(`tmp/components/${node.id}.tsx`, chakraWrap(html));
  node.component = dynamic(() => import(/* @vite-ignore */ `../../tmp/components/${node.id}.tsx`));
}
render(<IntentPage schema={schema} />);
```

*`chakraWrap()` injects `import { Box, Text, ... } from '@chakra-ui/react'` plus `export default function Comp(){return (<>${html}</>)};`*

---

## 5 • Embedding External Content (MVP‑safe)

### 5.1 Approved Iframe Sources (no CORS hacks)

* **YouTube**
* **Desmos** (calculator/graph)
* **Spotify** embeds
* **OpenStreetMap** tiles (leaflet)

Component example:

```tsx
<AspectRatio ratio={16/9} w="full">
  <iframe src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; encrypted-media" allowFullScreen />
</AspectRatio>
```

*For MVP we avoid sites that deny `X‑Frame‑Options`. In later sprints we can revisit proxy / WebView fallbacks.*

---

## 6 • File / Folder Layout

```
root
├─ package.json
├─ electron-builder.json
├─ src/
│  ├─ main.ts
│  ├─ preload.ts
│  ├─ renderer/
│  │  ├─ App.tsx
│  │  ├─ components/static/ (hand‑coded MVP demo blocks)
│  │  ├─ hooks/
│  │  ├─ theme.ts
│  │  └─ pages/IntentPage.tsx
│  └─ utils/claude.ts
└─ tmp/components/ (runtime‑generated)
```

---

## 7 • MVP Demo Scenarios

| Intent                                     | Rendered Blocks                                                 | Hard‑coded?             |
| ------------------------------------------ | --------------------------------------------------------------- | ----------------------- |
| **“Funny cat videos”**                     | Heading, YouTube video grid (4 iframes), autoplay toggle        | Generated               |
| **“Graphing calculator”**                  | Desmos iframe + tip text                                        | **Static (hand‑coded)** |
| **“Buy ivory court shoes for my wedding”** | Product carousel (3 cards), Reddit reviews, price tracker bar   | Generated               |
| **“Plan a weekend trip to Tokyo”**         | Day‑by‑day itinerary list, embedded map, weather forecast block | Static (hand‑coded)     |
| **“Pomodoro timer 25/5”**                  | Timer widget with start/stop + session count                    | Generated               |
| **“BTC price chart”**                      | Live line chart (using `react-chartjs-2`), refresh dropdown     | Static                  |
| **“Compare iPhone 15 vs Samsung S24”**     | Spec table, top review vids                                     | Generated               |

> **Hard‑coding strategy**: we pre‑author Chakra components in `renderer/components/static/`. When intent matches a whitelisted slug (`calc`, `tokyo-trip`, `btc-chart`), we bypass Claude for deterministic demo smoothness. Everything else flows through Claude.

Demo run‑through order: 1) shoes  2) calculator  3) cat videos  4) Tokyo planner  5) share intent link.

---

## 8 • Build & Packaging

* Run `yarn cross-env CLAUDE_KEY=$CLAUDE_KEY yarn build && yarn electron-builder --publish never`.
* Output: `IntentOS-0.1.0.dmg` (\~220 MB) & `IntentOS Setup 0.1.0.exe` (\~230 MB).

---

## 9 • Telemetry & Error Handling

* **Performance**: log `T_schema`, `T_components`, `T_firstRender`.
* **Crashes**: Sentry main + renderer.
* **Privacy**: only hashed intents stored (SHA‑256).

---

## 10 • Coming Soon (post‑demo)

1. Voice input (Whisper v3).
2. Block marketplace & sandbox.
3. Service‑worker offline snapshots.
4. Mobile PWA thin client.

---

## 11 • Phased Implementation Plan

### Phase 1: Electron Shell Foundation
**Goal**: Functional Electron app with basic window management and IPC setup.

**Deliverables**:
- Electron main process with BrowserWindow
- Preload script with context isolation
- Basic IPC bridge (`window.bridge`)
- Environment variable loading (.env support)
- Development hot-reload setup

**Test Suite**:
- Unit tests for IPC communication
- Integration tests for window lifecycle
- E2E test: app launches and displays window

**Testable Outcome**: 
```bash
npm run dev
# → Electron window opens with "Hello IntentOS" message
# → Dev tools accessible, IPC bridge exists in window.bridge
```

---

### Phase 2: React Renderer + Chakra UI
**Goal**: Complete UI foundation with OmniPrompt and theme system.

**Deliverables**:
- React 18 + Vite renderer setup
- Chakra UI with custom dark neon theme
- OmniPrompt component (glassmorphism design)
- Layout components (VStack, containers)
- Dev HUD (⌥ + D) for debugging

**Test Suite**:
- Component tests for OmniPrompt
- Theme tests (color palette, typography)
- Interaction tests (keyboard shortcuts)
- Visual regression tests

**Testable Outcome**:
```bash
npm run dev
# → App opens with centered OmniPrompt
# → Neon blue accent (#00E5FF), glassmorphism panels
# → ⌥ + D opens dev HUD drawer
# → Can type in prompt field
```

---

### Phase 3: Static Demo Components
**Goal**: Hand-coded components for reliable demo scenarios.

**Deliverables**:
- Static components: GraphingCalculator, TokyoTrip, BTCChart
- Component routing based on intent matching
- Framer Motion animations
- Component registry system

**Test Suite**:
- Component rendering tests
- Animation tests
- Intent matching logic tests
- Static data integration tests

**Testable Outcome**:
```bash
npm run dev
# Type "graphing calculator" → Desmos embed appears
# Type "tokyo trip" → Itinerary with map renders
# Type "btc chart" → Live price chart displays
# All with smooth fade-in animations
```

---

### Phase 4: Dynamic Layout System + AI Content Generation
**Goal**: Three-step AI pipeline: Intent → Layout Selection → Content Generation.

**Technical Architecture**:

#### 4.1 Pre-built Layout Templates
Create 7 reusable React layout components with defined content slots:

```typescript
// Layout Registry
interface LayoutSlot {
  id: string;
  type: 'iframe' | 'widget' | 'text' | 'media' | 'custom';
  props: Record<string, any>;
}

interface LayoutTemplate {
  name: string;
  description: string;
  component: React.FC<{slots: LayoutSlot[]}>;
  slotDefinitions: Array<{id: string, type: string, purpose: string}>;
}

const LAYOUTS: LayoutTemplate[] = [
  {
    name: 'SingleWebsite',
    description: 'Full-screen iframe for single website',
    slotDefinitions: [{id: 'main', type: 'iframe', purpose: 'primary website'}]
  },
  {
    name: 'SplitView', 
    description: 'Two side-by-side panels',
    slotDefinitions: [
      {id: 'left', type: 'iframe|widget', purpose: 'primary content'},
      {id: 'right', type: 'iframe|widget', purpose: 'secondary content'}
    ]
  },
  {
    name: 'Dashboard',
    description: 'Grid of 2-6 widgets/cards',
    slotDefinitions: Array.from({length: 6}, (_, i) => ({
      id: `widget-${i}`, type: 'widget', purpose: 'dashboard item'
    }))
  },
  {
    name: 'ListDetail',
    description: 'Left sidebar list, right detail view',
    slotDefinitions: [
      {id: 'list', type: 'widget', purpose: 'navigation/list'},
      {id: 'detail', type: 'iframe|widget', purpose: 'detail view'}
    ]
  },
  {
    name: 'MediaFocus',
    description: 'Large media area with controls',
    slotDefinitions: [
      {id: 'media', type: 'media', purpose: 'primary media'},
      {id: 'controls', type: 'widget', purpose: 'media controls'},
      {id: 'info', type: 'text', purpose: 'media information'}
    ]
  },
  {
    name: 'ComparisonView',
    description: 'Side-by-side comparison table/cards',
    slotDefinitions: Array.from({length: 4}, (_, i) => ({
      id: `item-${i}`, type: 'widget', purpose: 'comparison item'
    }))
  },
  {
    name: 'FeedLayout',
    description: 'Vertical scrolling feed of content',
    slotDefinitions: Array.from({length: 10}, (_, i) => ({
      id: `feed-${i}`, type: 'widget', purpose: 'feed item'
    }))
  }
];
```

#### 4.2 Three-Step AI Pipeline

**Step 1: Layout Selection (Fast & Cheap)**
```typescript
// New IPC method: bridge.selectLayout(intent)
const layoutPrompt = `
Intent: "${intent}"
Available layouts: ${LAYOUTS.map(l => `${l.name}: ${l.description}`).join(', ')}

Analyze the intent and select the best layout. Consider:
- Single website access → SingleWebsite
- Comparison/research → SplitView or ComparisonView  
- Multiple tools/data → Dashboard
- Media consumption → MediaFocus
- Sequential content → FeedLayout

Return only: {"layout": "LayoutName", "confidence": 0.95}
`;
```

**Step 2: Content Strategy Planning**
```typescript
// New IPC method: bridge.planContent(intent, selectedLayout)
const contentPrompt = `
Intent: "${intent}"
Layout: ${selectedLayout.name}
Available slots: ${JSON.stringify(selectedLayout.slotDefinitions)}

Plan content for each slot. Prioritize real websites when possible:
- Prefer iframe embeds over custom HTML
- Use established sites (YouTube, GitHub, Wikipedia, etc.)
- Only generate custom widgets when necessary

Return JSON:
{
  "slots": [
    {
      "id": "main",
      "type": "iframe", 
      "url": "https://www.example.com",
      "title": "Description"
    }
  ]
}
`;
```

**Step 3: Widget Generation (Only When Needed)**
```typescript
// Existing IPC method enhanced: bridge.callClaude('component', widgetSpec)
const widgetPrompt = `
Generate a Chakra UI widget for: ${widgetSpec.purpose}
Intent context: "${intent}"
Widget type: ${widgetSpec.type}

Return JSX using only these Chakra components:
Box, Text, VStack, HStack, Button, Input, Image, Grid, Card

No external APIs. Use placeholder data.
`;
```

#### 4.3 Implementation Pipeline

```typescript
// Enhanced App.tsx flow
const handleIntentSubmit = async (intent: string) => {
  try {
    // Step 1: Layout selection (< 500ms)
    const {layout, confidence} = await bridge.selectLayout(intent);
    
    if (confidence < 0.7) {
      // Fallback to static matching or default layout
      layout = 'Dashboard';
    }
    
    // Step 2: Content planning (< 1s)
    const contentPlan = await bridge.planContent(intent, layout);
    
    // Step 3: Generate any custom widgets (parallel, < 2s each)
    const slots = await Promise.all(
      contentPlan.slots.map(async (slot) => {
        if (slot.type === 'iframe') {
          return slot; // Use as-is
        } else {
          // Generate custom widget
          const widget = await bridge.callClaude('component', slot);
          return {...slot, component: widget};
        }
      })
    );
    
    // Render with selected layout
    setRenderedContent([{
      id: `intent-${Date.now()}`,
      type: 'dynamic',
      layout: layout,
      slots: slots,
      timestamp: Date.now()
    }]);
    
  } catch (error) {
    // Fallback to static components or error state
  }
};
```

#### 4.4 Caching Strategy

```typescript
// IndexedDB schema
interface CachedLayout {
  intent: string;
  intentHash: string; // SHA-256 for privacy
  layout: string;
  slots: LayoutSlot[];
  confidence: number;
  timestamp: number;
  expiresAt: number; // URLs may become stale
}

// Cache management
class LayoutCache {
  async get(intent: string): Promise<CachedLayout | null> {
    const hash = await sha256(intent);
    const cached = await db.layouts.where('intentHash').equals(hash).first();
    return cached && cached.expiresAt > Date.now() ? cached : null;
  }
  
  async set(intent: string, result: Omit<CachedLayout, 'intentHash' | 'timestamp'>) {
    const hash = await sha256(intent);
    await db.layouts.put({
      ...result,
      intent: intent,
      intentHash: hash,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24h TTL
    });
  }
}
```

**Deliverables**:
- 7 pre-built layout templates with slot system
- Three-step AI pipeline (layout → content → widgets)
- Smart caching with 24h TTL for dynamic content
- Fallback system for low-confidence selections
- Performance monitoring for each pipeline step

**Test Suite**:
- Layout template rendering tests
- AI pipeline integration tests (mocked responses)
- Cache hit/miss performance tests
- Content slot validation tests
- Error recovery and fallback tests

**Testable Outcome**:
```bash
npm run dev
# Type "funny cat videos" → Selects MediaFocus layout → YouTube iframe + custom controls
# Type "compare phones" → Selects ComparisonView → Phone spec widgets side-by-side  
# Type "weather dashboard" → Selects Dashboard → Weather widget grid with real data
# Type "plan tokyo trip" → Selects ListDetail → Itinerary list + Google Maps iframe
# All responses cached, <3s generation time, graceful fallbacks
```

---

### Phase 5: Production Polish + Packaging
**Goal**: Investor-ready build with telemetry and packaging.

**Deliverables**:
- Electron builder configuration
- Telemetry integration (performance metrics)
- Error tracking (Sentry)
- Auto-updater setup
- Signed builds for macOS/Windows

**Test Suite**:
- Build process tests
- Package integrity tests
- Auto-update tests
- Telemetry data validation
- Cross-platform compatibility tests

**Testable Outcome**:
```bash
npm run build
# → Generates IntentOS-0.1.0.dmg (~220MB)
# → Generates IntentOS Setup 0.1.0.exe (~230MB)
# → Both launch and run demo scenarios flawlessly
# → Telemetry data appears in dashboard
```

*Updated: 2025‑06‑23 — added 5-phase implementation plan with testable outcomes.*
