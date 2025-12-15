
// Mock Exchange Rate
// 1 USD = 1500 NGN
// 1 USD = ~100,000 Sats (Simplified for ease)
// => 1500 NGN = 100,000 Sats
// => 1 NGN = 66.66 Sats

const RATE_NGN_PER_USD = 1500;
const RATE_SATS_PER_USD = 100000; // Example rate

export const NGN_TO_SATS_RATE = RATE_SATS_PER_USD / RATE_NGN_PER_USD; // ~66.66

export function convertNGNtoSats(ngnAmount: number): number {
    return Math.ceil(ngnAmount * NGN_TO_SATS_RATE);
}

export function convertSatsToNGN(satsAmount: number): number {
    return Math.floor(satsAmount / NGN_TO_SATS_RATE);
}

export function formatNGN(amount: number): string {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}
