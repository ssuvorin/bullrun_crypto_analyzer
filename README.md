# 🚀 BullRun Crypto Analyzer

> AI-powered cryptocurrency analysis tool for Bull Run game on Infinex

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequests.com)

## 📖 About

Bull Run Crypto Analyzer is a sophisticated web application that helps players make informed decisions in the Bull Run game on Infinex. Using AI-powered market analysis, real-time data, and interactive charts, it provides strategic recommendations for cryptocurrency card selection.

### ✨ Key Features

- 🤖 **AI-Powered Analysis** - Smart market analysis using Google Gemini AI
- 📊 **Real-time Data** - Live cryptocurrency prices and market indicators
- 📈 **Interactive Charts** - TradingView integration for detailed analysis
- 🌍 **Multi-language** - English and Chinese support
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔒 **Secure Architecture** - Server-side API key protection
- 💾 **Local Storage** - Save your selected cards

## 🎯 How It Works

### AI Analysis Strategies

1. **Bear Market** (>60% cryptos falling):
   - Strategy: USDC x2 + DAI x2 + USDT x1
   - Risk: Low | Expected Return: 0-2%

2. **Bull Market** (>60% cryptos rising):
   - Strategy: BTC x2 + ETH x2 + SOL x1
   - Risk: High | Expected Return: 15-25%

3. **Mixed Market**:
   - Strategy: USDC x2 + BTC x2 + ETH x1
   - Risk: Medium | Expected Return: 3-10%

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bullrun-crypto-analyzer.git
   cd bullrun-crypto-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bullrun-crypto-analyzer)

1. Fork this repository
2. Connect to Vercel
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy!

### Heroku

```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_api_key

# Deploy
git push heroku main
```

### Docker

```bash
# Build image
docker build -t bullrun-analyzer .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key bullrun-analyzer
```

## 🛠 Tech Stack

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Backend**: Node.js, Express.js
- **AI**: Google Gemini 1.5 Flash
- **APIs**: CoinGecko, Fear & Greed Index, TradingView
- **Deployment**: Vercel, Heroku, Docker

## 📊 Supported Cryptocurrencies

The app analyzes 30 cryptocurrencies available in Bull Run:

| Major Coins | DeFi Tokens | Stablecoins | Meme Coins |
|-------------|-------------|-------------|------------|
| BTC, ETH    | UNI, LINK   | USDC, DAI   | DOGE, SHIB |
| BNB, SOL    | DOT, AVAX   | USDT, USDe  | PEPE       |
| ADA, XRP    | MATIC, NEAR | STETH       |            |

## 🔒 Security Features

- ✅ Server-side API key storage
- ✅ Environment variable protection
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Infinex](https://infinex.xyz/) for the Bull Run game
- [CoinGecko](https://coingecko.com/) for cryptocurrency data
- [TradingView](https://tradingview.com/) for charting
- [Google Gemini](https://ai.google.dev/) for AI analysis

## 📞 Support

- 🐛 [Report Bug](https://github.com/yourusername/bullrun-crypto-analyzer/issues)
- 💡 [Request Feature](https://github.com/yourusername/bullrun-crypto-analyzer/issues)
- 💬 [Contact Developer](https://x.com/MazinoTower)

---

**⚠️ Disclaimer**: This tool is for educational purposes only. Always do your own research before making investment decisions.

**Made with ❤️ for the crypto community** 
