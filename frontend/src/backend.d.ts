import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RewardsRate {
    miles?: number;
    cashBack?: number;
    points?: number;
}
export interface CreditCard {
    id: bigint;
    apr: APRRange;
    categories: Array<string>;
    creditScoreRequired: string;
    annualFee: number;
    signupBonus: string;
    name: string;
    description: string;
    issuer: string;
    rewardsRate: RewardsRate;
}
export interface APRRange {
    max: number;
    min: number;
}
export interface backendInterface {
    getAllCards(): Promise<Array<CreditCard>>;
    getAllCategories(): Promise<Array<string>>;
    getCardsByCategory(category: string): Promise<Array<CreditCard>>;
    getSortedCards(sortOption: string): Promise<Array<CreditCard>>;
    initialize(): Promise<void>;
}
