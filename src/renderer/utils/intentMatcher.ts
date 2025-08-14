export interface IntentMatch {
  component: string;
  confidence: number;
  keywords: string[];
}

interface IntentPattern {
  component: string;
  keywords: string[];
  aliases: string[];
  phrases: string[];
}

const intentPatterns: IntentPattern[] = [
  {
    component: 'GraphingCalculator',
    keywords: ['calculator', 'calc', 'math', 'graph', 'equation', 'function', 'plot'],
    aliases: ['desmos', 'graphing', 'mathematics', 'algebra', 'calculus', 'trigonometry', 'geometry'],
    phrases: [
      'graphing calculator',
      'math calculator',
      'plot functions',
      'solve equations',
      'mathematical graphing',
      'desmos calculator',
      'plot graphs',
      'calculate functions'
    ]
  },
  {
    component: 'PhysicsHomework',
    keywords: ['physics', 'chemistry', 'engineering', 'formula', 'science', 'lab', 'experiment'],
    aliases: ['scientific', 'mechanics', 'thermodynamics', 'electricity', 'magnetism', 'waves', 'optics', 'kinematics', 'dynamics', 'periodic', 'molecule'],
    phrases: [
      'tools for my physics homework',
      'help with physics homework',
      'physics calculations',
      'chemistry calculations',
      'engineering calculations',
      'physics tools',
      'scientific calculator',
      'physics homework',
      'chemistry homework',
      'solve physics problems',
      'physics formulas',
      'science homework',
      'physics lab',
      'chemistry lab',
      'physics study guide',
      'periodic table',
      'unit converter',
      'physics simulator'
    ]
  },
  {
    component: 'TokyoTrip',
    keywords: ['kyoto', 'japan', 'temple', 'shrine', 'bamboo', 'geisha'],
    aliases: ['japanese', 'fushimi', 'arashiyama', 'gion', 'kiyomizu', 'nijo'],
    phrases: [
      'kyoto trip',
      'kyoto weekend plan',
      'trip to kyoto', 
      'kyoto itinerary', 
      'visit kyoto',
      'kyoto travel',
      'japan trip',
      'kyoto vacation',
      'kyoto sightseeing',
      'weekend in kyoto',
      'plan a trip to kyoto',
      'kyoto travel guide',
      'what to do in kyoto',
      'kyoto attractions',
      'plan my kyoto trip',
      'help me plan kyoto',
      'kyoto travel planner',
      'kyoto itinerary planner',
      'explore kyoto',
      'kyoto adventure',
      'kyoto temples',
      'kyoto shrines',
      'bamboo forest',
      'gion district'
    ]
  },
  {
    component: 'BTCChart',
    keywords: ['bitcoin', 'btc', 'crypto', 'price', 'chart', 'cryptocurrency', 'trading', 'coin'],
    aliases: ['blockchain', 'digital currency', 'investment', 'market', 'stocks', 'currency'],
    phrases: [
      'bitcoin price',
      'crypto chart',
      'btc price',
      'bitcoin chart',
      'cryptocurrency prices',
      'crypto market',
      'bitcoin trading',
      'digital currency',
      'bitcoin',
      'crypto',
      'btc'
    ]
  },
  {
    component: 'WeatherWidget',
    keywords: ['weather', 'forecast', 'temperature', 'climate', 'rain', 'snow', 'wind', 'sunny', 'cloudy', 'hot', 'cold', 'humidity'],
    aliases: ['meteorology', 'conditions', 'pressure', 'storm', 'today', 'tomorrow', 'week'],
    phrases: [
      'weather forecast',
      'weather report',
      'temperature today',
      'weather conditions',
      'local weather',
      'weather widget',
      'forecast widget',
      'weather',
      'what is the weather like',
      'how is the weather',
      'weather today',
      'weather tomorrow',
      'weekly weather',
      'check the weather',
      'weather for my city',
      'current weather',
      'weather update',
      'is it going to rain',
      'temperature forecast'
    ]
  }
];

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
}

function calculateScore(intent: string, pattern: IntentPattern): number {
  const normalizedIntent = normalizeText(intent);
  let score = 0;
  let matchedKeywords = 0;

  // Check for exact phrase matches (highest weight)
  for (const phrase of pattern.phrases) {
    if (normalizedIntent.includes(normalizeText(phrase))) {
      score += 80;
      // If we have an exact phrase match, it's very likely the right component
      return Math.min(score, 100);
    }
  }

  // Check for keyword matches (must be word boundaries)
  const intentWords = normalizedIntent.split(' ');
  for (const keyword of pattern.keywords) {
    // Check for exact word match or if the word contains the keyword
    if (intentWords.some(word => word === keyword || (keyword.length > 3 && word.includes(keyword)))) {
      score += 25;
      matchedKeywords++;
    }
  }

  // Check for alias matches (lower weight)
  for (const alias of pattern.aliases) {
    if (intentWords.some(word => word === alias || (alias.length > 3 && word.includes(alias)))) {
      score += 15;
    }
  }

  // Require at least 2 keyword matches for a valid match
  if (matchedKeywords < 2 && score < 80) {
    score = score * 0.5; // Heavily penalize single keyword matches
  }

  return Math.min(score, 100);
}

export function matchIntent(intent: string): IntentMatch | null {
  if (!intent || intent.trim().length === 0) {
    return null;
  }

  const matches = intentPatterns.map(pattern => ({
    component: pattern.component,
    confidence: calculateScore(intent, pattern),
    keywords: pattern.keywords
  }));

  // Sort by confidence score
  matches.sort((a, b) => b.confidence - a.confidence);

  const bestMatch = matches[0];

  // Only return matches with confidence above threshold
  if (bestMatch.confidence >= 50) {
    return {
      component: bestMatch.component,
      confidence: Math.min(bestMatch.confidence, 100), // Cap at 100%
      keywords: bestMatch.keywords
    };
  }

  return null;
}

export function getAvailableComponents(): string[] {
  return intentPatterns.map(pattern => pattern.component);
}

export function getComponentSuggestions(): string[] {
  return [
    'Try "tools for my physics homework"',
    'Try "kyoto weekend plan" for travel planning', 
    'Try "bitcoin chart" for crypto prices',
    'Try "what is the weather like" for forecasts'
  ];
}