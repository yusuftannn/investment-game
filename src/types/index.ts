export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: { screen?: keyof MainTabParamList } | undefined;
  MarketDetail: { symbol: string };
  Deposit: undefined;
  Watchlist: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Market: undefined;
  Trade: undefined;
  Portfolio: undefined;
  Profile: undefined;
};

export type PortfolioPosition = {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  changePercent: number;
  marketValue: number;
  allocation: number;
};

export type Market = {
  symbol: string;
  name: string;
  price: number;
  change: number; // percent
  market: MarketCategory;
};

export type MarketCategory = 'us' | 'bist' | 'funds' | 'crypto';
