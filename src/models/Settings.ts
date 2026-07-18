export interface Settings {
  globalCuotaPrice: number;
  pricePolicy?: PricePolicy;
}
export type PricePolicy = Record<number, number>;
