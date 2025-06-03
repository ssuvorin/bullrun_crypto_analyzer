class GeminiAI {
  constructor() {
    // API ключ теперь хранится на сервере
    this.baseUrl = '/api/analyze';
  }

  async analyzeCards(cryptoData, historicalData) {
    try {
      console.log('Sending request to server...');
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cryptoData: cryptoData,
          historicalData: historicalData
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        throw new Error(`Server error: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Server response received:', result);
      
      return result;
    } catch (error) {
      console.error('Client Error:', error);
      
      // Если сервер недоступен, возвращаем fallback
      if (error.message.includes('fetch') || error.message.includes('Server error')) {
        console.log('Server unavailable, returning fallback response');
        return this.createFallbackResponse(cryptoData);
      }
      
      throw error;
    }
  }

  // Fallback функция остается на клиенте для случаев когда сервер недоступен
  createFallbackResponse(cryptoData = null) {
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
        // МЕДВЕЖИЙ РЫНОК
        selectedCards = [
          {
            symbol: 'USDC',
            quantity: 2,
            confidence: 95,
            reasoning: 'Bear market detected - stablecoin protection strategy (offline mode)'
          },
          {
            symbol: 'DAI',
            quantity: 2,
            confidence: 95,
            reasoning: 'Bear market defense - diversified stablecoin protection (offline mode)'
          },
          {
            symbol: 'USDT',
            quantity: 1,
            confidence: 90,
            reasoning: 'Completing full stablecoin portfolio for capital preservation (offline mode)'
          }
        ];
        strategy = 'Offline bear market defense: Maximum stablecoin allocation to preserve capital';
        riskLevel = 'low';
        expectedReturn = '0-2%';
        totalConfidence = 93;
      } else {
        const positiveCount = cryptoData.filter(crypto => crypto.change24h > 0).length;
        
        if (positiveCount / totalCount > bearMarketThreshold) {
          // БЫЧИЙ РЫНОК
          selectedCards = [
            {
              symbol: 'BTC',
              quantity: 2,
              confidence: 85,
              reasoning: 'Bull market detected - doubling down on market leader (offline mode)'
            },
            {
              symbol: 'ETH',
              quantity: 2,
              confidence: 82,
              reasoning: 'Strong bull momentum - taking maximum exposure to ETH (offline mode)'
            },
            {
              symbol: 'SOL',
              quantity: 1,
              confidence: 78,
              reasoning: 'High-growth altcoin for bull market diversification (offline mode)'
            }
          ];
          strategy = 'Offline bull market strategy: Maximum exposure to top performers';
          riskLevel = 'high';
          expectedReturn = '15-25%';
          totalConfidence = 82;
        } else {
          // СМЕШАННЫЙ РЫНОК
          selectedCards = [
            {
              symbol: 'USDC',
              quantity: 2,
              confidence: 90,
              reasoning: 'Mixed market conditions - stablecoin protection (offline mode)'
            },
            {
              symbol: 'BTC',
              quantity: 2,
              confidence: 75,
              reasoning: 'Market leader hedge in uncertain conditions (offline mode)'
            },
            {
              symbol: 'ETH',
              quantity: 1,
              confidence: 70,
              reasoning: 'Limited exposure to growth potential while maintaining safety (offline mode)'
            }
          ];
          strategy = 'Offline balanced strategy: Stablecoin protection with selective crypto exposure';
          riskLevel = 'medium';
          expectedReturn = '3-10%';
          totalConfidence = 78;
        }
      }
    } else {
      // Fallback без данных
      selectedCards = [
        {
          symbol: 'USDC',
          quantity: 2,
          confidence: 90,
          reasoning: 'No market data available - conservative stablecoin protection (offline mode)'
        },
        {
          symbol: 'BTC',
          quantity: 2,
          confidence: 75,
          reasoning: 'Safe hedge with market leader (offline mode)'
        },
        {
          symbol: 'DAI',
          quantity: 1,
          confidence: 85,
          reasoning: 'Additional stablecoin diversification (offline mode)'
        }
      ];
      strategy = 'Offline conservative fallback: Stablecoin protection with BTC hedge';
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

  // Упрощенная функция для исторических данных (может остаться на клиенте)
  async getHistoricalData(symbols, hours = 48) {
    const historicalData = {};
    
    for (const symbol of symbols) {
      try {
        const coinId = this.getCoinGeckoId(symbol);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=2&interval=hourly`
        );
        
        if (response.ok) {
          const data = await response.json();
          historicalData[symbol] = {
            prices: data.prices,
            volumes: data.total_volumes,
            marketCaps: data.market_caps
          };
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
      }
    }
    
    return historicalData;
  }

  getCoinGeckoId(symbol) {
    const symbolMap = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'ADA': 'cardano',
      'AVAX': 'avalanche-2',
      'BCH': 'bitcoin-cash',
      'DAI': 'dai',
      'DOGE': 'dogecoin',
      'DOT': 'polkadot',
      'ICP': 'internet-computer',
      'KAS': 'kaspa',
      'LEO': 'leo-token',
      'LINK': 'chainlink',
      'LTC': 'litecoin',
      'MATIC': 'matic-network',
      'NEAR': 'near',
      'PEPE': 'pepe',
      'SHIB': 'shiba-inu',
      'SOL': 'solana',
      'STETH': 'staked-ether',
      'TON': 'ton-crystal',
      'TRX': 'tron',
      'UNI': 'uniswap',
      'USDC': 'usd-coin',
      'USDe': 'ethena-usde',
      'USDT': 'tether',
      'WBTC': 'wrapped-bitcoin',
      'WEETH': 'wrapped-eeth',
      'XLM': 'stellar',
      'XRP': 'ripple'
    };
    
    return symbolMap[symbol] || symbol.toLowerCase();
  }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeminiAI;
} else {
  window.GeminiAI = GeminiAI;
} 