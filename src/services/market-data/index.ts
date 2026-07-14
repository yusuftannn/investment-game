export const marketDataService = {
  getMarkets: async () => [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 193.4, change: 2.8 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 120.75, change: 5.1 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 247.1, change: -1.3 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 334.2, change: 1.5 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 135.6, change: 0.9 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 132.8, change: -0.4 },
    { symbol: 'FB', name: 'Meta Platforms', price: 196.3, change: 0.7 },
  ],
  getSymbols: async () => ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'FB'],
};
