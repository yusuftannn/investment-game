export type NewsCategory = "all" | "markets" | "stocks" | "crypto" | "economy";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: Exclude<NewsCategory, "all">;
  symbol?: string;
  featured?: boolean;
};

export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Markets open the week with renewed risk appetite",
    summary: "Technology and financial shares lead gains as investors focus on the new earnings season.",
    source: "Market Brief",
    publishedAt: "12 min",
    category: "markets",
    featured: true,
  },
  {
    id: "2",
    title: "BIST 100 tests a key resistance level",
    summary: "Banking shares support the index while trading volume remains above its monthly average.",
    source: "Borsa Gündem",
    publishedAt: "35 min",
    category: "stocks",
    symbol: "XU100",
  },
  {
    id: "3",
    title: "Bitcoin holds above the psychological threshold",
    summary: "Crypto markets remain steady as institutional inflows offset short-term profit taking.",
    source: "Crypto Desk",
    publishedAt: "1 hr",
    category: "crypto",
    symbol: "BTC",
  },
  {
    id: "4",
    title: "Investors turn to the next inflation reading",
    summary: "Bond yields move in a narrow range before the data that may shape rate expectations.",
    source: "Economy Daily",
    publishedAt: "2 hr",
    category: "economy",
  },
  {
    id: "5",
    title: "Chip stocks extend their positive momentum",
    summary: "Demand expectations around artificial intelligence keep the semiconductor sector in focus.",
    source: "Wall Street Note",
    publishedAt: "3 hr",
    category: "stocks",
    symbol: "NVDA",
  },
  {
    id: "6",
    title: "Gold remains supported by safe-haven demand",
    summary: "The precious metal consolidates after recent gains as the dollar trades mixed.",
    source: "Global Markets",
    publishedAt: "4 hr",
    category: "markets",
    symbol: "XAU",
  },
];

export const newsCategoryLabels: Record<NewsCategory, string> = {
  all: "All",
  markets: "Markets",
  stocks: "Stocks",
  crypto: "Crypto",
  economy: "Economy",
};
