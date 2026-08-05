const GHS_RATE = 12;

export function toGhs(usdAmount: number): number {
  return usdAmount * GHS_RATE;
}

export function formatPrice(usdAmount: number): string {
  return `GH₵${toGhs(usdAmount).toFixed(2)}`;
}
