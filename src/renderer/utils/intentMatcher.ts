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
    aliases: ['desmos', 'graphing', 'mathematics', 'algebra', 'calculus'],
    phrases: [
      'graphing calculator',
      'math calculator',
      'plot functions',
      'solve equations',
      'mathematical graphing',
      'desmos calculator'
    ]
  },
  {
    component: 'TokyoTrip',
    keywords: ['tokyo', 'japan', 'trip', 'travel', 'itinerary', 'vacation', 'visit'],
    aliases: ['japanese', 'asia', 'sightseeing', 'tourist', 'holiday'],
    phrases: [
      'trip to tokyo',
      'tokyo itinerary', 
      'visit tokyo',
      'tokyo travel',
      'japan trip',
      'tokyo vacation',
      'tokyo sightseeing',
      'weekend in tokyo'
    ]
  },
  {
    component: 'BTCChart',
    keywords: ['bitcoin', 'btc', 'crypto', 'price', 'chart', 'cryptocurrency', 'trading'],
    aliases: ['blockchain', 'digital currency', 'investment', 'market', 'stocks'],
    phrases: [
      'bitcoin price',
      'crypto chart',
      'btc price',
      'bitcoin chart',
      'cryptocurrency prices',
      'crypto market',
      'bitcoin trading',
      'digital currency'
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
    'Try "calculator" for math functions',
    'Try "tokyo trip" for travel planning', 
    'Try "bitcoin chart" for crypto prices'
  ];
}