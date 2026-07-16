type CreateOrderPayload = {
  mode: 'spot' | 'margin';
  symbol: string;
  side: 'buy' | 'sell' | 'long' | 'short';
  quantity: number;
  price: number;
  leverage?: number;
};

export const tradingService = {
  createOrder: async (payload: CreateOrderPayload) => ({
    ok: true,
    payload,
  }),
};
