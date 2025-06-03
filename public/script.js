const translations = {
  en: {
    title: "Bull Cards",
    searchPlaceholder: "Search...",
    footerText: "If you have ideas on how to improve, write to ",
    notFound: "Card not found",
    langSwitch: "Switch to Chinese",
    playBullrun: "Play Bullrun",
    infoPanel: "Hello, glad you visited my site. I'm not a coding pro, but I tried to make a convenient site where you can view the charts of cryptocurrencies available in the Bullrun game on Infinex. Clicking on each card will open a chart. The site was created for quick analysis to understand when to \"Lock a card\" and also to choose cards for the next round.",
    todayCardsTitle: "You Playing Today",
    allCardsTitle: "All Cards",
    addToToday: "Add to Today's Cards",
    compareSelected: "Compare Selected",
    searchX: "Search on X",
    showNews: "Show latest news about",
    clearAll: "Clear All",
    proMode: "Pro Mode",
    basicMode: "Basic Mode",
    compareHint: "Select two cards to compare charts in real-time",
    fearGreedIndex: "Fear & Greed Index",
    btcDominance: "BTC Dominance",
    totalMarketCap: "Total Market Cap",
    altcoinMarketCap: "Altcoin Market Cap",
    waitingForData: "Waiting for data",
    aiAnalysis: "AI Analysis",
    generateAIPicks: "Generate AI Picks",
    aiAnalyzing: "AI Analyzing...",
    aiRecommendations: "AI Recommendations",
    confidence: "Confidence",
    strategy: "Strategy",
    riskLevel: "Risk Level",
    expectedReturn: "Expected Return",
    applyAIPicks: "Apply AI Picks"
  },
  zh: {
    title: "加密货币仪表板",
    searchPlaceholder: "搜索加密货币...",
    footerText: "如果您有改进的想法，请写信给 ",
    notFound: "未找到加密货币",
    langSwitch: "切换到英文",
    playBullrun: "玩Bullrun",
    infoPanel: "你好，很高兴你访问我的网站。我不是编码专家，但尽力为你们打造一个方便的网站，让你们可以查看Infinex上Bullrun游戏中加密货币的图表。点击每张卡片即可打开图表。这个网站是为快速分析设计的，帮助你了解何时可以\"锁定卡片\"，以及为下一轮选择卡片。",
    todayCardsTitle: "今日玩的卡片",
    allCardsTitle: "所有卡片",
    addToToday: "添加到今日卡片",
    compareSelected: "比较所选",
    searchX: "在X上搜索",
    showNews: "显示有关的最新新闻",
    clearAll: "清除所有",
    proMode: "专业模式",
    basicMode: "基本模式",
    compareHint: "选择两张卡片以实时比较图表",
    fearGreedIndex: "恐惧与贪婪指数",
    btcDominance: "比特币主导地位",
    totalMarketCap: "总市值",
    altcoinMarketCap: "替代币市值",
    waitingForData: "等待数据",
    aiAnalysis: "AI分析",
    generateAIPicks: "生成AI推荐",
    aiAnalyzing: "AI分析中...",
    aiRecommendations: "AI推荐",
    confidence: "置信度",
    strategy: "策略",
    riskLevel: "风险等级",
    expectedReturn: "预期收益",
    applyAIPicks: "应用AI推荐"
  }
};

const cryptoSymbols = [
  "bitcoin", "ethereum", "binancecoin", "cardano", "avalanche-2", "bitcoin-cash",
  "dai", "dogecoin", "polkadot", "internet-computer", "kaspa", "leo-token",
  "chainlink", "litecoin", "matic-network", "near", "pepe", "shiba-inu",
  "solana", "staked-ether", "ton-crystal", "tron", "uniswap", "usd-coin",
  "ethena-usde", "tether", "wrapped-bitcoin", "wrapped-eeth", "stellar", "ripple"
];

const localImages = ["kas", "steth", "ton", "usde", "weeth", "near", "pepe", "shib"];

const cryptos = [
  "ADA", "AVAX", "BCH", "BNB", "BTC", "DAI", "DOGE", "DOT", "ETH", "ICP",
  "KAS", "LEO", "LINK", "LTC", "MATIC", "NEAR", "PEPE", "SHIB", "SOL",
  "STETH", "TON", "TRX", "UNI", "USDC", "USDe", "USDT", "WBTC", "WEETH",
  "XLM", "XRP"
].map(symbol => ({
  id: symbol,
  name: symbol,
  image: localImages.includes(symbol.toLowerCase())
    ? `/images/${symbol.toLowerCase()}.png`
    : `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${symbol.toLowerCase()}.png`,
  change: "0.00",
  price: "$0.00"
}));

const cardContainer = document.getElementById("card-container");
const todayCardContainer = document.getElementById("today-card-container");
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".modal .close");
const proModeBtn = document.getElementById("pro-mode-btn");
const mobileProModeBtn = document.getElementById("mobile-pro-mode-btn");
const compareSelectedBtn = document.getElementById("compare-selected-btn");
const compareSection = document.getElementById("compare-section");
const chartContainerWrapper = document.getElementById("chart-container-wrapper");
const todayCardsSection = document.getElementById("today-cards");
const clearAllBtn = document.getElementById("clear-all-btn");
const burgerMenu = document.querySelector(".burger-menu");
const mobileMenuContent = document.querySelector(".mobile-menu-content");
const fearGreedPanels = document.getElementById("fear-greed-panels");

let currentCryptos = null;
let currentPeriod = "24h";
const todayCards = new Map();
let todayCardList = [];
let selectedCryptos = [];
let isProMode = false;
let fearGreedValue = null;
let btcDominanceValue = null;
let totalMarketCapValue = null;
let altcoinMarketCapValue = null;

// AI Integration variables
let geminiAI = null;
let aiAnalysisResults = null;
let isAIAnalyzing = false;

// Simple API client for Vercel
class APIClient {
  async analyzeCards(cryptoData, historicalData) {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cryptoData,
        historicalData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getHistoricalData(symbols) {
    // Mock historical data for now
    return symbols.map(symbol => ({
      symbol,
      price_48h_ago: Math.random() * 100,
      current_price: Math.random() * 100
    }));
  }
}

// Initialize API client
function initializeAI() {
  geminiAI = new APIClient();
}

// Call initialization when page loads
document.addEventListener('DOMContentLoaded', () => {
  initializeAI();
  
  // Add AI button event listeners
  const aiBtn = document.getElementById('ai-generate-btn');
  const mobileAiBtn = document.getElementById('mobile-ai-generate-btn');
  
  if (aiBtn) {
    aiBtn.addEventListener('click', generateAIPicks);
  }
  
  if (mobileAiBtn) {
    mobileAiBtn.addEventListener('click', generateAIPicks);
  }
});

burgerMenu.addEventListener("click", () => {
  burgerMenu.classList.toggle("active");
  mobileMenuContent.classList.toggle("active");
  document.body.classList.toggle("menu-open");
});

mobileMenuContent.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    burgerMenu.classList.remove("active");
    mobileMenuContent.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
});

function setLanguage(lang) {
  document.querySelector("title").textContent = translations[lang].title;
  document.getElementById("search").placeholder = translations[lang].searchPlaceholder;
  document.getElementById("mobile-search").placeholder = translations[lang].searchPlaceholder;
  document.getElementById("footer-text").textContent = translations[lang].footerText;
  document.documentElement.lang = lang;
  document.getElementById("lang-switch").textContent = translations[lang].langSwitch;
  document.getElementById("mobile-lang-switch").textContent = translations[lang].langSwitch;
  document.querySelector(".play-bullrun-btn").textContent = translations[lang].playBullrun;
  document.querySelector(".mobile-play-bullrun-btn").textContent = translations[lang].playBullrun;
  document.querySelector(".info-panel p").textContent = translations[lang].infoPanel;
  document.getElementById("today-cards-title").textContent = translations[lang].todayCardsTitle;
  document.getElementById("all-cards-title").textContent = translations[lang].allCardsTitle;
  proModeBtn.textContent = isProMode ? translations[lang].basicMode : translations[lang].proMode;
  mobileProModeBtn.textContent = isProMode ? translations[lang].basicMode : translations[lang].proMode;
  compareSelectedBtn.textContent = translations[lang].compareSelected;
  document.getElementById("compare-hint").textContent = translations[lang].compareHint;
  clearAllBtn.textContent = translations[lang].clearAll;
  
  // Update AI button texts
  const aiBtn = document.getElementById('ai-generate-btn');
  const mobileAiBtn = document.getElementById('mobile-ai-generate-btn');
  
  if (aiBtn) {
    aiBtn.textContent = isAIAnalyzing ? 
      translations[lang].aiAnalyzing : 
      translations[lang].generateAIPicks;
  }
  
  if (mobileAiBtn) {
    mobileAiBtn.textContent = isAIAnalyzing ? 
      translations[lang].aiAnalyzing : 
      translations[lang].generateAIPicks;
  }
  
  displayCards(cryptos, cardContainer, false);
  updateTodayCardsSection();
  updateFearGreedPanels();
  
  // Refresh AI results if they exist
  if (aiAnalysisResults) {
    displayAIResults();
  }
}

function createCard(crypto, isTodaySection = false) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-id", crypto.id);

  const img = document.createElement("img");
  img.src = crypto.image;
  img.alt = crypto.name;
  img.loading = "lazy";
  img.onerror = function() { this.src = `https://via.placeholder.com/50?text=${crypto.name}`; };

  const nameEl = document.createElement("div");
  nameEl.classList.add("crypto-name");
  nameEl.textContent = crypto.name;

  const changeEl = document.createElement("div");
  changeEl.classList.add("crypto-change");
  changeEl.textContent = (crypto.change >= 0 ? "+" : "") + crypto.change + "%";
  changeEl.classList.add(crypto.change >= 0 ? "positive" : "negative");

  const priceEl = document.createElement("div");
  priceEl.classList.add("crypto-price");
  priceEl.textContent = crypto.price;

  card.appendChild(img);
  card.appendChild(nameEl);
  card.appendChild(changeEl);
  card.appendChild(priceEl);

  if (!isTodaySection && isProMode) {
    if (selectedCryptos.length < 2 || selectedCryptos.some(c => c.id === crypto.id)) {
      const checkboxWrapper = document.createElement("div");
      checkboxWrapper.classList.add("checkbox-wrapper");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("card-checkbox");
      checkbox.checked = selectedCryptos.some(c => c.id === crypto.id);
      checkbox.disabled = checkbox.checked;
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) handleCheckboxChange(crypto, true);
      });

      const resetBtn = document.createElement("span");
      resetBtn.classList.add("checkbox-reset");
      resetBtn.textContent = "×";
      resetBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleCheckboxChange(crypto, false);
      });

      checkboxWrapper.appendChild(checkbox);
      if (checkbox.checked) checkboxWrapper.appendChild(resetBtn);
      card.appendChild(checkboxWrapper);
    }

    const searchXBtn = document.createElement("button");
    searchXBtn.classList.add("search-x-btn");
    searchXBtn.textContent = translations[document.documentElement.lang].searchX;
    searchXBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.open(`https://x.com/search?q=%24${crypto.name}&src=typed_query`, "_blank");
    });
    card.appendChild(searchXBtn);
  }

  if (!isTodaySection) {
    const addBtn = document.createElement("button");
    addBtn.classList.add("add-btn");
    addBtn.textContent = translations[document.documentElement.lang].addToToday;
    const count = todayCards.get(crypto.id) || 0;
    addBtn.disabled = count >= 2 || todayCardList.length >= 5;
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToTodayCards(crypto);
    });
    card.appendChild(addBtn);
  }

  card.addEventListener("click", (e) => {
    if (!e.target.matches("button, input, span")) {
      openModal([crypto]);
    }
  });

  if (isTodaySection) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => removeFromTodayCards(crypto));
    wrapper.appendChild(card);
    wrapper.appendChild(removeBtn);
    return wrapper;
  }

  return card;
}

function handleCheckboxChange(crypto, isChecked) {
  if (!isProMode) return;
  if (isChecked) {
    if (selectedCryptos.length < 2) selectedCryptos.push(crypto);
  } else {
    selectedCryptos = selectedCryptos.filter(c => c.id !== crypto.id);
  }
  compareSelectedBtn.disabled = selectedCryptos.length !== 2;
  compareSelectedBtn.style.backgroundColor = selectedCryptos.length === 2 ? "#FE6F39" : "#555";
  displayCards(cryptos, cardContainer, false);
}

function displayCards(cards, container = cardContainer, isTodaySection = false) {
  container.innerHTML = "";
  if (cards.length === 0 && !isTodaySection) {
    container.innerHTML = `<p>${translations[document.documentElement.lang].notFound}</p>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  cards.forEach(crypto => fragment.appendChild(createCard(crypto, isTodaySection)));
  container.appendChild(fragment);
}

function addToTodayCards(crypto) {
  if (todayCardList.length >= 5) return;
  const count = todayCards.get(crypto.id) || 0;
  if (count < 2) {
    todayCards.set(crypto.id, count + 1);
    todayCardList.push(crypto);
    updateTodayCardsSection();
    displayCards(cryptos, cardContainer, false);
    localStorage.setItem("todayCardList", JSON.stringify(todayCardList.map(c => c.id)));
  }
}

function removeFromTodayCards(crypto) {
  const index = todayCardList.findIndex(c => c.id === crypto.id);
  if (index !== -1) {
    todayCardList.splice(index, 1);
    const count = todayCards.get(crypto.id);
    if (count > 1) todayCards.set(crypto.id, count - 1);
    else todayCards.delete(crypto.id);
    updateTodayCardsSection();
    displayCards(cryptos, cardContainer, false);
    localStorage.setItem("todayCardList", JSON.stringify(todayCardList.map(c => c.id)));
  }
}

function clearTodayCards() {
  todayCardList = [];
  todayCards.clear();
  updateTodayCardsSection();
  displayCards(cryptos, cardContainer, false);
  localStorage.setItem("todayCardList", JSON.stringify([]));
}

function updateTodayCardsSection() {
  todayCardsSection.style.display = todayCardList.length > 0 ? "block" : "none";
  if (todayCardList.length > 0) {
    displayCards(todayCardList, todayCardContainer, true);
    clearAllBtn.style.display = todayCardList.length >= 3 ? "block" : "none";
  }
}

function toggleProMode() {
  isProMode = !isProMode;
  const lang = document.documentElement.lang;
  proModeBtn.textContent = isProMode ? translations[lang].basicMode : translations[lang].proMode;
  mobileProModeBtn.textContent = isProMode ? translations[lang].basicMode : translations[lang].proMode;
  compareSection.style.display = isProMode ? "block" : "none";
  fearGreedPanels.style.display = isProMode ? "flex" : "none";
  selectedCryptos = [];
  compareSelectedBtn.disabled = true;
  compareSelectedBtn.style.backgroundColor = "#555";
  displayCards(cryptos, cardContainer, false);
  if (isProMode) {
    updateFearGreedPanels(); 
  }
}

async function fetchCryptoData() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoSymbols.join(",")}`
    );
    const data = await response.json();
    data.forEach(item => {
      const crypto = cryptos.find(c => c.id.toLowerCase() === item.symbol.toLowerCase());
      if (crypto) {
        crypto.price = "$" + item.current_price.toFixed(2);
        crypto.change = item.price_change_percentage_24h.toFixed(2);
      }
    });
    displayCards(cryptos, cardContainer, false);
    updateTodayCardsSection();
  } catch (error) {
    displayCards(cryptos, cardContainer, false);
    updateTodayCardsSection();
  }
}

function loadTodayCards() {
  const savedCards = localStorage.getItem("todayCardList");
  todayCardList = [];
  todayCards.clear();
  if (savedCards) {
    const parsedCards = JSON.parse(savedCards);
    parsedCards.forEach(id => {
      const crypto = cryptos.find(c => c.id === id);
      if (crypto) {
        const count = todayCards.get(crypto.id) || 0;
        todayCards.set(crypto.id, count + 1);
        todayCardList.push(crypto);
      }
    });
    updateTodayCardsSection();
  }
}

async function fetchFearGreedIndex() {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    fearGreedValue = data.data[0].value;
    if (isProMode) updateFearGreedPanels();
  } catch (error) {
    fearGreedValue = null;
    if (isProMode) updateFearGreedPanels();
  }
}

async function fetchBtcDominance() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/global");
    const data = await response.json();
    btcDominanceValue = parseFloat(data.data.market_cap_percentage.btc).toFixed(2);
    if (isProMode) updateFearGreedPanels();
  } catch (error) {
    btcDominanceValue = null;
    if (isProMode) updateFearGreedPanels();
  }
}

async function fetchTotalMarketCap() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/global");
    const data = await response.json();
    totalMarketCapValue = (data.data.total_market_cap.usd / 1e12).toFixed(2);
    if (isProMode) updateFearGreedPanels();
  } catch (error) {
    totalMarketCapValue = null;
    if (isProMode) updateFearGreedPanels();
  }
}

async function fetchAltcoinMarketCap() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/global");
    const data = await response.json();
    const totalMarketCap = data.data.total_market_cap.usd;
    const btcMarketCap = (data.data.market_cap_percentage.btc / 100) * totalMarketCap;
    altcoinMarketCapValue = ((totalMarketCap - btcMarketCap) / 1e12).toFixed(2);
    if (isProMode) updateFearGreedPanels();
  } catch (error) {
    altcoinMarketCapValue = null;
    if (isProMode) updateFearGreedPanels();
  }
}

function updateFearGreedPanels() {
  const lang = document.documentElement.lang;

  const panel1 = document.getElementById("panel-1");
  panel1.innerHTML = "";
  const title1 = document.createElement("h3");
  title1.textContent = translations[lang].fearGreedIndex;
  title1.style.color = "#FE6F39";
  title1.style.fontSize = "14px";
  title1.style.margin = "0 0 5px 0";
  panel1.appendChild(title1);
  if (fearGreedValue !== null) {
    const valueSpan = document.createElement("span");
    valueSpan.textContent = fearGreedValue;
    panel1.appendChild(valueSpan);
    const categoryP = document.createElement("p");
    categoryP.textContent = getFearGreedCategory(fearGreedValue);
    panel1.appendChild(categoryP);
  } else {
    const naSpan = document.createElement("span");
    naSpan.textContent = "N/A";
    panel1.appendChild(naSpan);
    const waitingP = document.createElement("p");
    waitingP.textContent = translations[lang].waitingForData;
    panel1.appendChild(waitingP);
  }

  const panel2 = document.getElementById("panel-2");
  panel2.innerHTML = "";
  const title2 = document.createElement("h3");
  title2.textContent = translations[lang].btcDominance;
  title2.style.color = "#FE6F39";
  title2.style.fontSize = "14px";
  title2.style.margin = "0 0 5px 0";
  panel2.appendChild(title2);
  if (btcDominanceValue !== null) {
    const valueSpan = document.createElement("span");
    valueSpan.textContent = btcDominanceValue + "%";
    panel2.appendChild(valueSpan);
  } else {
    const naSpan = document.createElement("span");
    naSpan.textContent = "N/A";
    panel2.appendChild(naSpan);
    const waitingP = document.createElement("p");
    waitingP.textContent = translations[lang].waitingForData;
    panel2.appendChild(waitingP);
  }

  const panel3 = document.getElementById("panel-3");
  panel3.innerHTML = "";
  const title3 = document.createElement("h3");
  title3.textContent = translations[lang].totalMarketCap;
  title3.style.color = "#FE6F39";
  title3.style.fontSize = "14px";
  title3.style.margin = "0 0 5px 0";
  panel3.appendChild(title3);
  if (totalMarketCapValue !== null) {
    const valueSpan = document.createElement("span");
    valueSpan.textContent = totalMarketCapValue + "T";
    panel3.appendChild(valueSpan);
    const unitP = document.createElement("p");
    unitP.textContent = "USD";
    panel3.appendChild(unitP);
  } else {
    const naSpan = document.createElement("span");
    naSpan.textContent = "N/A";
    panel3.appendChild(naSpan);
    const waitingP = document.createElement("p");
    waitingP.textContent = translations[lang].waitingForData;
    panel3.appendChild(waitingP);
  }

  const panel4 = document.getElementById("panel-4");
  panel4.innerHTML = "";
  const title4 = document.createElement("h3");
  title4.textContent = translations[lang].altcoinMarketCap;
  title4.style.color = "#FE6F39";
  title4.style.fontSize = "14px";
  title4.style.margin = "0 0 5px 0";
  panel4.appendChild(title4);
  if (altcoinMarketCapValue !== null) {
    const valueSpan = document.createElement("span");
    valueSpan.textContent = altcoinMarketCapValue + "T";
    panel4.appendChild(valueSpan);
    const unitP = document.createElement("p");
    unitP.textContent = "USD";
    panel4.appendChild(unitP);
  } else {
    const naSpan = document.createElement("span");
    naSpan.textContent = "N/A";
    panel4.appendChild(naSpan);
    const waitingP = document.createElement("p");
    waitingP.textContent = translations[lang].waitingForData;
    panel4.appendChild(waitingP);
  }
}

function openModal(cryptos) {
  currentCryptos = cryptos;
  chartContainerWrapper.className = cryptos.length === 1 ? "single-chart" : "double-chart";
  modal.classList.add("show");
  loadChartData(cryptos, currentPeriod);

  const existingNewsBtn = document.getElementById("news-btn");
  if (existingNewsBtn) existingNewsBtn.remove();

  if (isProMode && cryptos.length === 1) {
    const newsBtn = document.createElement("button");
    newsBtn.id = "news-btn";
    newsBtn.classList.add("search-x-btn");
    newsBtn.textContent = `${translations[document.documentElement.lang].showNews} ${cryptos[0].name}`;
    newsBtn.addEventListener("click", () => {
      window.open(`https://www.tradingview.com/symbols/${cryptos[0].name}USD/news/`, "_blank");
    });
    chartContainerWrapper.appendChild(newsBtn);
  }
}

function closeModal() {
  modal.classList.remove("show");
  document.getElementById("tv_chart_container_1").innerHTML = "";
  document.getElementById("tv_chart_container_2").innerHTML = "";
  chartContainerWrapper.className = "";
  const newsBtn = document.getElementById("news-btn");
  if (newsBtn) newsBtn.remove();
}

function mapPeriodToInterval(period) {
  return { "15m": "15", "1h": "60", "6h": "240", "24h": "D" }[period] || "D";
}

function loadChartData(cryptos, period) {
  const containers = ["tv_chart_container_1", "tv_chart_container_2"];
  containers.forEach(id => document.getElementById(id).innerHTML = "");
  
  cryptos.slice(0, 2).forEach((crypto, index) => {
    new TradingView.widget({
      autosize: true,
      symbol: "BINANCE:" + crypto.name + "USDT",
      interval: mapPeriodToInterval(period),
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: document.documentElement.lang,
      container_id: containers[index],
      toolbar_bg: "#101114",
      hide_top_toolbar: true,
      withdateranges: false,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      details: true,
      hotlist: true
    });
  });

  document.getElementById("tv_chart_container_2").style.display = cryptos.length === 1 ? "none" : "block";
}

function getFearGreedCategory(value) {
  if (value <= 25) return "Extreme Fear";
  if (value <= 45) return "Fear";
  if (value <= 55) return "Neutral";
  if (value <= 75) return "Greed";
  return "Extreme Greed";
}

let isLoaded = false;
document.addEventListener("DOMContentLoaded", async () => {
  if (!isLoaded) {
    isLoaded = true;
    setLanguage("en");
    loadTodayCards();
    await fetchCryptoData();
    setInterval(fetchCryptoData, 300000);

    await Promise.all([
      fetchFearGreedIndex(),
      fetchBtcDominance(),
      fetchTotalMarketCap(),
      fetchAltcoinMarketCap()
    ]);
    setInterval(fetchFearGreedIndex, 6 * 60 * 60 * 1000);
    setInterval(fetchBtcDominance, 6 * 60 * 60 * 1000);
    setInterval(fetchTotalMarketCap, 6 * 60 * 60 * 1000);
    setInterval(fetchAltcoinMarketCap, 6 * 60 * 60 * 1000);

    document.getElementById("panel-1").addEventListener("click", () => {
      window.open("https://www.tradingview.com/script/uWmdPA82-Crypto-Fear-Greed-Index/", "_blank");
    });
    document.getElementById("panel-2").addEventListener("click", () => {
      window.open("https://www.coingecko.com/en/global-charts", "_blank");
    });
    document.getElementById("panel-3").addEventListener("click", () => {
      window.open("https://www.coingecko.com/en/global-charts", "_blank");
    });
    document.getElementById("panel-4").addEventListener("click", () => {
      window.open("https://www.coingecko.com/en/global-charts", "_blank");
    });

    document.getElementById("lang-switch").addEventListener("click", () => {
      setLanguage(document.documentElement.lang === "en" ? "zh" : "en");
    });

    document.getElementById("mobile-lang-switch").addEventListener("click", () => {
      setLanguage(document.documentElement.lang === "en" ? "zh" : "en");
    });

    document.getElementById("search").addEventListener("input", function() {
      const filtered = cryptos.filter(c => c.name.toLowerCase().includes(this.value.toLowerCase()));
      displayCards(filtered, cardContainer, false);
    });

    document.getElementById("mobile-search").addEventListener("input", function() {
      const filtered = cryptos.filter(c => c.name.toLowerCase().includes(this.value.toLowerCase()));
      displayCards(filtered, cardContainer, false);
    });

    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    document.querySelector(".info-panel .close-btn").addEventListener("click", () => {
      document.querySelector(".info-panel").style.display = "none";
    });

    document.querySelector(".play-bullrun-btn").addEventListener("click", () => {
      window.open("https://app.infinex.xyz/play", "_blank");
    });

    document.querySelector(".mobile-play-bullrun-btn").addEventListener("click", () => {
      window.open("https://app.infinex.xyz/play", "_blank");
    });

    proModeBtn.addEventListener("click", toggleProMode);
    mobileProModeBtn.addEventListener("click", toggleProMode);

    compareSelectedBtn.addEventListener("click", () => {
      if (isProMode && selectedCryptos.length === 2) {
        openModal(selectedCryptos);
        selectedCryptos = [];
        compareSelectedBtn.disabled = true;
        compareSelectedBtn.style.backgroundColor = "#555";
        displayCards(cryptos, cardContainer, false);
      }
    });

    clearAllBtn.addEventListener("click", clearTodayCards);

    document.querySelectorAll(".period-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".period-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentPeriod = btn.getAttribute("data-period");
        if (currentCryptos) loadChartData(currentCryptos, currentPeriod);
      });
    });
  }
});

// AI Analysis Functions
async function generateAIPicks() {
  if (!geminiAI || isAIAnalyzing) return;
  
  isAIAnalyzing = true;
  updateAIButton(true);
  
  try {
    // Получаем текущие данные криптовалют
    const cryptoData = cryptos.map(crypto => ({
      symbol: crypto.id,
      name: crypto.name,
      price: crypto.price,
      change24h: parseFloat(crypto.change),
      image: crypto.image
    }));
    
    // Получаем исторические данные за 48 часов
    const symbols = cryptos.map(c => c.id);
    const historicalData = await geminiAI.getHistoricalData(symbols);
    
    // Добавляем рыночные данные
    const marketData = {
      fearGreedIndex: fearGreedValue,
      btcDominance: btcDominanceValue,
      totalMarketCap: totalMarketCapValue,
      altcoinMarketCap: altcoinMarketCapValue
    };
    
    // Анализируем с помощью AI
    aiAnalysisResults = await geminiAI.analyzeCards(cryptoData, {
      historical: historicalData,
      market: marketData
    });
    
    displayAIResults();
    
  } catch (error) {
    console.error('AI Analysis Error:', error);
    showAIError(error.message);
  } finally {
    isAIAnalyzing = false;
    updateAIButton(false);
  }
}

function updateAIButton(analyzing) {
  const lang = document.documentElement.lang;
  const aiBtn = document.getElementById('ai-generate-btn');
  const mobileAiBtn = document.getElementById('mobile-ai-generate-btn');
  
  if (aiBtn) {
    aiBtn.textContent = analyzing ? 
      translations[lang].aiAnalyzing : 
      translations[lang].generateAIPicks;
    aiBtn.disabled = analyzing;
  }
  
  if (mobileAiBtn) {
    mobileAiBtn.textContent = analyzing ? 
      translations[lang].aiAnalyzing : 
      translations[lang].generateAIPicks;
    mobileAiBtn.disabled = analyzing;
  }
}

function displayAIResults() {
  if (!aiAnalysisResults) return;
  
  const lang = document.documentElement.lang;
  const aiResultsContainer = document.getElementById('ai-results');
  
  if (!aiResultsContainer) return;
  
  aiResultsContainer.innerHTML = '';
  aiResultsContainer.style.display = 'block';
  
  // Заголовок
  const title = document.createElement('h3');
  title.textContent = translations[lang].aiRecommendations;
  title.style.color = '#FE6F39';
  title.style.marginBottom = '15px';
  aiResultsContainer.appendChild(title);
  
  // Общая информация
  const infoDiv = document.createElement('div');
  infoDiv.className = 'ai-info';
  infoDiv.innerHTML = `
    <div class="ai-stat">
      <span class="ai-label">${translations[lang].confidence}:</span>
      <span class="ai-value">${aiAnalysisResults.totalConfidence}%</span>
    </div>
    <div class="ai-stat">
      <span class="ai-label">${translations[lang].riskLevel}:</span>
      <span class="ai-value">${aiAnalysisResults.riskLevel}</span>
    </div>
    <div class="ai-stat">
      <span class="ai-label">${translations[lang].expectedReturn}:</span>
      <span class="ai-value">${aiAnalysisResults.expectedReturn}</span>
    </div>
  `;
  aiResultsContainer.appendChild(infoDiv);
  
  // Стратегия
  if (aiAnalysisResults.strategy) {
    const strategyDiv = document.createElement('div');
    strategyDiv.className = 'ai-strategy';
    strategyDiv.innerHTML = `
      <h4>${translations[lang].strategy}:</h4>
      <p>${aiAnalysisResults.strategy}</p>
    `;
    aiResultsContainer.appendChild(strategyDiv);
  }
  
  // Рекомендованные карточки
  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'ai-recommended-cards';
  
  aiAnalysisResults.selectedCards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'ai-card-recommendation';
    
    const crypto = cryptos.find(c => c.id === card.symbol);
    if (crypto) {
      cardEl.innerHTML = `
        <div class="ai-card-info">
          <img src="${crypto.image}" alt="${card.symbol}" width="24" height="24">
          <span class="ai-card-symbol">${card.symbol}</span>
          <span class="ai-card-quantity">x${card.quantity}</span>
          <span class="ai-card-confidence">${card.confidence}%</span>
        </div>
        <div class="ai-card-reasoning">${card.reasoning}</div>
      `;
    }
    
    cardsDiv.appendChild(cardEl);
  });
  
  aiResultsContainer.appendChild(cardsDiv);
  
  // Кнопка применения
  const applyBtn = document.createElement('button');
  applyBtn.className = 'ai-apply-btn';
  applyBtn.textContent = translations[lang].applyAIPicks;
  applyBtn.addEventListener('click', applyAIPicks);
  aiResultsContainer.appendChild(applyBtn);
}

function applyAIPicks() {
  if (!aiAnalysisResults || !aiAnalysisResults.selectedCards) return;
  
  // Очищаем текущие карточки
  clearTodayCards();
  
  // Добавляем рекомендованные карточки
  aiAnalysisResults.selectedCards.forEach(card => {
    const crypto = cryptos.find(c => c.id === card.symbol);
    if (crypto) {
      for (let i = 0; i < card.quantity; i++) {
        addToTodayCards(crypto);
      }
    }
  });
  
  updateTodayCardsSection();
  
  // Показываем уведомление
  showNotification('AI recommendations applied successfully!');
}

function showAIError(message) {
  const aiResultsContainer = document.getElementById('ai-results');
  if (aiResultsContainer) {
    aiResultsContainer.innerHTML = `
      <div class="ai-error">
        <h3>AI Analysis Error</h3>
        <p>${message}</p>
      </div>
    `;
    aiResultsContainer.style.display = 'block';
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
