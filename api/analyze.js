export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cryptoData, historicalData } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = buildAnalysisPrompt(cryptoData, historicalData);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return res.status(response.status).json({ error: 'AI service unavailable' });
    }

    const data = await response.json();
    const result = parseAIResponse(data, cryptoData);
    
    res.json(result);
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function buildAnalysisPrompt(cryptoData, historicalData) {
  return `You are a cryptocurrency analysis expert for the Bull Run game. Your task is to select an optimal set of EXACTLY 5 cards for the next round.

GAME RULES:
- Select EXACTLY 5 cards from 30 available cryptocurrencies
- Maximum 2 identical cards in the set (you can take the same crypto twice if it has high potential)
- Goal: maximize profit based on 48-hour price movements
- Strategy: If a cryptocurrency shows very strong potential for growth, take 2 cards of it to maximize gains

AVAILABLE CARDS:
${cryptoData.map(crypto => `${crypto.symbol}: $${crypto.price} (${crypto.change24h > 0 ? '+' : ''}${crypto.change24h.toFixed(2)}%)`).join('\n')}

MARKET ANALYSIS GUIDELINES:
- BULL MARKET (most cryptos showing positive gains): Take 2 cards of high-momentum cryptos with strong uptrends
- BEAR MARKET (most cryptos showing negative performance): Prioritize STABLECOINS for protection
- Available stablecoins: DAI, USDC, USDe, USDT
- In bear market: Take maximum stablecoins (2x DAI, 2x USDC, 1x USDT = 5 cards) to minimize losses
- Mixed market: Balance between growth potential and stability

ANALYSIS STRATEGY:
1. Count how many cryptos have negative 24h performance
2. If >60% are negative: BEAR MARKET - prioritize stablecoins
3. If >60% are positive: BULL MARKET - focus on high-momentum cryptos
4. Mixed market: balanced approach

IMPORTANT: Respond ONLY in JSON format without any additional text. Use EXACTLY this format:

{
  "selectedCards": [
    {
      "symbol": "USDC",
      "quantity": 2,
      "confidence": 90,
      "reasoning": "Bear market detected - stablecoin protection strategy"
    },
    {
      "symbol": "DAI", 
      "quantity": 2,
      "confidence": 90,
      "reasoning": "Bear market protection with stable value"
    },
    {
      "symbol": "USDT",
      "quantity": 1,
      "confidence": 85,
      "reasoning": "Completing stablecoin defense portfolio"
    }
  ],
  "totalConfidence": 88,
  "strategy": "Bear market defense: Maximum stablecoin allocation to preserve capital during market downturn",
  "riskLevel": "low",
  "expectedReturn": "0-2%"
}

REQUIREMENTS:
1. selectedCards must contain EXACTLY 5 cards total
2. Sum of all quantity values must be EXACTLY 5
3. Each card can have quantity 1 or 2 (take 2 if crypto has exceptional potential OR for stablecoin protection)
4. Use only symbols from the list above
5. confidence from 1 to 100
6. riskLevel: "low" (bear/stablecoins), "medium" (mixed), "high" (aggressive bull)
7. All text must be in English
8. Explain market conditions and strategy in reasoning

Analyze the data and return JSON:`;
}

function parseAIResponse(data, cryptoData = null) {
  try {
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response structure from Gemini API');
    }
    
    const text = data.candidates[0].content.parts[0].text;
    console.log('Raw AI response:', text);
    
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch) {
        jsonMatch = [codeBlockMatch[1]];
      }
    }
    
    if (!jsonMatch) {
      console.warn('No JSON found in response, creating fallback');
      return createFallbackResponse(cryptoData);
    }
    
    let jsonStr = jsonMatch[0];
    
    jsonStr = jsonStr
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ');
    
    console.log('Cleaned JSON:', jsonStr);
    
    const parsed = JSON.parse(jsonStr);
    
    if (!validateResponse(parsed)) {
      console.warn('Invalid response structure, creating fallback');
      return createFallbackResponse(cryptoData);
    }
    
    return parsed;
    
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return createFallbackResponse(cryptoData);
  }
}

function validateResponse(response) {
  if (!response || !Array.isArray(response.selectedCards)) {
    return false;
  }
  
  if (response.selectedCards.length === 0) {
    return false;
  }
  
  const totalQuantity = response.selectedCards.reduce((sum, card) => sum + (card.quantity || 0), 0);
  if (totalQuantity !== 5) {
    console.warn(`Invalid total quantity: ${totalQuantity}, expected 5`);
    return false;
  }
  
  const validCards = response.selectedCards.every(card => 
    card.symbol && 
    typeof card.quantity === 'number' && 
    card.quantity >= 1 && 
    card.quantity <= 2 &&
    typeof card.confidence === 'number' &&
    card.reasoning
  );
  
  if (!validCards) {
    return false;
  }
  
  return (
    typeof response.totalConfidence === 'number' &&
    response.strategy &&
    response.riskLevel &&
    response.expectedReturn
  );
}

function createFallbackResponse(cryptoData = null) {
  let selectedCards = [];
  let strategy = '';
  let riskLevel = 'medium';
  let expectedReturn = '5-12%';
  let totalConfidence = 80;
  
  if (cryptoData && cryptoData.length > 0) {
    const negativeCount = cryptoData.filter(crypto => crypto.change24h < 0).length;
    const totalCount = cryptoData.length;
    const bearMarketThreshold = 0.6;
    
    if (negativeCount / totalCount > bearMarketThreshold) {
      selectedCards = [
        {
          symbol: 'USDC',
          quantity: 2,
          confidence: 95,
          reasoning: 'Bear market detected - stablecoin protection strategy with maximum allocation'
        },
        {
          symbol: 'DAI',
          quantity: 2,
          confidence: 95,
          reasoning: 'Bear market defense - diversified stablecoin protection'
        },
        {
          symbol: 'USDT',
          quantity: 1,
          confidence: 90,
          reasoning: 'Completing full stablecoin portfolio for capital preservation'
        }
      ];
      strategy = 'Full bear market defense: Maximum stablecoin allocation to preserve capital during market downturn';
      riskLevel = 'low';
      expectedReturn = '0-2%';
      totalConfidence = 93;
    } else {
      const positiveCount = cryptoData.filter(crypto => crypto.change24h > 0).length;
      
      if (positiveCount / totalCount > bearMarketThreshold) {
        selectedCards = [
          {
            symbol: 'BTC',
            quantity: 2,
            confidence: 85,
            reasoning: 'Bull market detected - doubling down on market leader for maximum gains'
          },
          {
            symbol: 'ETH',
            quantity: 2,
            confidence: 82,
            reasoning: 'Strong bull momentum - taking maximum exposure to ETH growth'
          },
          {
            symbol: 'SOL',
            quantity: 1,
            confidence: 78,
            reasoning: 'High-growth altcoin for bull market diversification'
          }
        ];
        strategy = 'Aggressive bull market strategy: Maximum exposure to top performers for capital growth';
        riskLevel = 'high';
        expectedReturn = '15-25%';
        totalConfidence = 82;
      } else {
        selectedCards = [
          {
            symbol: 'USDC',
            quantity: 2,
            confidence: 90,
            reasoning: 'Mixed market conditions - stablecoin protection against volatility'
          },
          {
            symbol: 'BTC',
            quantity: 2,
            confidence: 75,
            reasoning: 'Market leader hedge in uncertain conditions'
          },
          {
            symbol: 'ETH',
            quantity: 1,
            confidence: 70,
            reasoning: 'Limited exposure to growth potential while maintaining safety'
          }
        ];
        strategy = 'Balanced strategy: Stablecoin protection combined with selective crypto exposure';
        riskLevel = 'medium';
        expectedReturn = '3-10%';
        totalConfidence = 78;
      }
    }
  } else {
    selectedCards = [
      {
        symbol: 'USDC',
        quantity: 2,
        confidence: 90,
        reasoning: 'No market data available - conservative stablecoin protection'
      },
      {
        symbol: 'BTC',
        quantity: 2,
        confidence: 75,
        reasoning: 'Safe hedge with market leader'
      },
      {
        symbol: 'DAI',
        quantity: 1,
        confidence: 85,
        reasoning: 'Additional stablecoin diversification'
      }
    ];
    strategy = 'Conservative fallback: Stablecoin protection with BTC hedge due to uncertain conditions';
    riskLevel = 'low';
    expectedReturn = '2-8%';
    totalConfidence = 83;
  }
  
  return {
    selectedCards: selectedCards,
    totalConfidence: totalConfidence,
    strategy: strategy,
    riskLevel: riskLevel,
    expectedReturn: expectedReturn
  };
} 