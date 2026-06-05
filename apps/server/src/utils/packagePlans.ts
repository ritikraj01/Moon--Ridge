export interface PackagePlanInput {
  name: string;
  price: number;
  numberOfPersons?: number;
  features?: string[];
}

export interface EnrichedPackagePlan {
  name: string;
  price: number;
  numberOfPersons: number;
  features: string[];
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

export function enrichPlan(plan: PackagePlanInput): EnrichedPackagePlan {
  const numberOfPersons = normalizeNumberOfPersons(plan.numberOfPersons);
  const price = Number(plan.price) || 0;
  return {
    name: plan.name,
    price,
    numberOfPersons,
    features: plan.features ?? [],
    pricePerPerson: computePricePerPerson(price, numberOfPersons),
  };
}

export function enrichPlans(
  plans: PackagePlanInput[] | undefined | null
): EnrichedPackagePlan[] {
  if (!plans?.length) return [];
  return plans.map(enrichPlan);
}

export function getStartingOffer(
  pricing: number,
  plans: PackagePlanInput[] | undefined | null,
  baseNumberOfPersons?: number
): {
  price: number;
  numberOfPersons: number;
  pricePerPerson: number;
} {
  const enriched = enrichPlans(plans);
  if (enriched.length > 0) {
    const cheapest = enriched.reduce((min, p) =>
      p.price < min.price ? p : min
    );
    return {
      price: cheapest.price,
      numberOfPersons: cheapest.numberOfPersons,
      pricePerPerson: cheapest.pricePerPerson,
    };
  }
  const persons = normalizeNumberOfPersons(baseNumberOfPersons);
  return {
    price: pricing,
    numberOfPersons: persons,
    pricePerPerson: computePricePerPerson(pricing, persons),
  };
}

export function validatePlans(
  plans: PackagePlanInput[] | undefined | null
): string | null {
  if (!plans?.length) return null;

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    if (!plan?.name?.trim()) {
      return `Plan ${i + 1}: name is required`;
    }
    if (!Number.isFinite(Number(plan.price)) || Number(plan.price) < 0) {
      return `Plan "${plan.name}": valid package price is required`;
    }
    const persons = normalizeNumberOfPersons(plan.numberOfPersons);
    if (persons < 1) {
      return `Plan "${plan.name}": number of travelers must be at least 1`;
    }
  }
  return null;
}

export function normalizePlansForStorage(
  plans: PackagePlanInput[] | undefined | null
): Omit<EnrichedPackagePlan, "pricePerPerson">[] {
  return enrichPlans(plans).map(({ name, price, numberOfPersons, features }) => ({
    name,
    price,
    numberOfPersons,
    features,
  }));
}

export function enrichPackageResponse<T extends Record<string, unknown>>(
  pkg: T
): T & {
  plans: EnrichedPackagePlan[];
  startingPrice: number;
  startingNumberOfPersons: number;
  startingPricePerPerson: number;
} {
  const pricing = Number(pkg.pricing) || 0;
  const numberOfPersons = normalizeNumberOfPersons(pkg.numberOfPersons);
  const plans = enrichPlans(pkg.plans as PackagePlanInput[] | undefined);
  const starting = getStartingOffer(pricing, plans, numberOfPersons);

  return {
    ...pkg,
    numberOfPersons,
    plans,
    startingPrice: starting.price,
    startingNumberOfPersons: starting.numberOfPersons,
    startingPricePerPerson: starting.pricePerPerson,
  };
}
