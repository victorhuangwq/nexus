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
    keywords: ['physics', 'homework', 'chemistry', 'engineering', 'study', 'solve', 'formula', 'tools', 'help', 'science', 'lab', 'experiment'],
    aliases: ['scientific', 'mechanics', 'thermodynamics', 'electricity', 'magnetism', 'waves', 'optics', 'kinematics', 'dynamics'],
    phrases: [
      'tools for my physics homework',
      'help with physics homework',
      'physics calculations',
      'chemistry calculations',
      'engineering calculations',
      'physics tools',
      'scientific calculator',
      'homework help',
      'study tools',
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
    keywords: ['kyoto', 'japan', 'trip', 'travel', 'itinerary', 'vacation', 'visit', 'plan', 'weekend', 'holiday', 'sightseeing', 'tourist', 'guide', 'temple', 'shrine', 'bamboo', 'geisha', 'traditional'],
    aliases: ['japanese', 'asia', 'planning', 'adventure', 'explore', 'destinations', 'places', 'cultural', 'historic', 'ancient'],
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

  // Check for exact phrase matches (highest weight)
  for (const phrase of pattern.phrases) {
    if (normalizedIntent.includes(normalizeText(phrase))) {
      score += 100;
    }
  }

  // Check for keyword matches
  for (const keyword of pattern.keywords) {
    if (normalizedIntent.includes(keyword)) {
      score += 50;
    }
  }

  // Check for alias matches
  for (const alias of pattern.aliases) {
    if (normalizedIntent.includes(alias)) {
      score += 30;
    }
  }

  // Bonus for multiple matches
  const words = normalizedIntent.split(' ');
  const allTerms = [...pattern.keywords, ...pattern.aliases];
  const matchingWords = words.filter(word => 
    allTerms.some(term => word.includes(term) || term.includes(word))
  );
  
  if (matchingWords.length > 1) {
    score += matchingWords.length * 20;
  }

  return score;
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