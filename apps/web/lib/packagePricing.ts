export interface PackagePlan {
  name: string;
  price: number;
  numberOfPersons: number;
  features?: string[];
  pricePerPerson?: number;
}

export interface StartingOffer {
  price: number;
  numberOfPersons: number;
  pricePerPerson: number;
}

const DEFAULT_NUMBER_OF_PERSONS = 1;

export function normalizeNumberOfPersons(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_NUMBER_OF_PERSONS;
  return Math.floor(n);
}

export function computePricePerPerson(
  price: number,
  numberOfPersons: number
): number {
  if (!numberOfPersons || numberOfPersons < 1) return price;
  return Math.round(price / numberOfPersons);
}

export function normalizePlan(plan: {
  name: string;
  price: number;
  numberOfPersons?: number;
  features?: string[];
  pricePerPerson?: number;
}): PackagePlan {
  const numberOfPersons = normalizeNumberOfPersons(plan.numberOfPersons);
  const price = Number(plan.price) || 0;
  return {
    name: plan.name,
    price,
    numberOfPersons,
    features: plan.features ?? [],
    pricePerPerson:
      plan.pricePerPerson ?? computePricePerPerson(price, numberOfPersons),
  };
}

export function normalizePlans(
  plans: Array<{
    name: string;
    price: number;
    numberOfPersons?: number;
    features?: string[];
    pricePerPerson?: number;
  }> | undefined | null
): PackagePlan[] {
  if (!plans?.length) return [];
  return plans.map(normalizePlan);
}

export function getStartingOffer(
  pricing: number,
  plans?: Array<{
    name: string;
    price: number;
    numberOfPersons?: number;
    pricePerPerson?: number;
  }> | null,
  baseNumberOfPersons?: number
): StartingOffer {
  const normalized = normalizePlans(plans ?? []);
  if (normalized.length > 0) {
    const cheapest = normalized.reduce((min, p) =>
      p.price < min.price ? p : min
    );
    return {
      price: cheapest.price,
      numberOfPersons: cheapest.numberOfPersons,
      pricePerPerson: cheapest.pricePerPerson!,
    };
  }
  const persons = normalizeNumberOfPersons(baseNumberOfPersons);
  return {
    price: pricing,
    numberOfPersons: persons,
    pricePerPerson: computePricePerPerson(pricing, persons),
  };
}

export function formatPackagePrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatTravelersLabel(count: number): string {
  return `For ${count} ${count === 1 ? "Traveler" : "Travelers"}`;
}

export function formatPlanCapacity(price: number, numberOfPersons: number): string {
  return `${formatPackagePrice(price)} for ${numberOfPersons} ${numberOfPersons === 1 ? "Traveler" : "Travelers"}`;
}

export function getPlanCapacityError(
  travelers: number,
  numberOfPersons: number,
  planName?: string
): string | null {
  if (travelers <= numberOfPersons) return null;
  const prefix = planName ? `"${planName}" plan` : "Selected plan";
  return `${prefix} supports only ${numberOfPersons} ${numberOfPersons === 1 ? "traveler" : "travelers"}. Please choose a larger plan.`;
}
