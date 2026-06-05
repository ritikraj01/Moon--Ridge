"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatPackagePrice,
  formatPlanCapacity,
  getPlanCapacityError,
  normalizePlans,
  type PackagePlan,
} from "@/lib/packagePricing";

interface Package {
  title: string;
  pricing: number;
  numberOfPersons?: number;
  plans?: PackagePlan[];
}

interface BookingSidebarProps {
  pkg: Package;
  whatsappNumber: string;
}

export default function BookingSidebar({ pkg, whatsappNumber }: BookingSidebarProps) {
  const plans = useMemo(() => normalizePlans(pkg.plans), [pkg.plans]);

  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0]?.name ?? "");
  const baseTravelers = pkg.numberOfPersons ?? 1;
  const [travelers, setTravelers] = useState<number>(
    plans[0]?.numberOfPersons ?? baseTravelers
  );

  const planDetails = useMemo(
    () => plans.find((p) => p.name === selectedPlan) ?? null,
    [plans, selectedPlan]
  );

  useEffect(() => {
    if (planDetails) {
      setTravelers((prev) =>
        prev > planDetails.numberOfPersons
          ? planDetails.numberOfPersons
          : Math.max(1, prev)
      );
    }
  }, [planDetails?.name, planDetails?.numberOfPersons]);

  const totalPrice = planDetails ? planDetails.price : pkg.pricing || 0;
  const numberOfPersons = planDetails?.numberOfPersons ?? baseTravelers;
  const pricePerPerson =
    planDetails?.pricePerPerson ??
    (numberOfPersons > 0 ? Math.round(totalPrice / numberOfPersons) : totalPrice);

  const capacityError = planDetails
    ? getPlanCapacityError(travelers, planDetails.numberOfPersons, planDetails.name)
    : getPlanCapacityError(travelers, baseTravelers);

  const canBook = !capacityError;

  const cleanNumber = whatsappNumber.replace(/[^\d]/g, "");

  let message = `Hi! I want to book the "${pkg.title}" package. `;
  if (selectedPlan && planDetails) {
    message += `Plan: "${selectedPlan}" (${formatPlanCapacity(planDetails.price, planDetails.numberOfPersons)}). Travelers: ${travelers}. Total: ${formatPackagePrice(totalPrice)}.`;
  } else {
    message += `Travelers: ${travelers}. Total: ${formatPackagePrice(totalPrice)}.`;
  }

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  const handlePlanChange = (planName: string) => {
    setSelectedPlan(planName);
    const plan = plans.find((p) => p.name === planName);
    if (plan) {
      setTravelers(plan.numberOfPersons);
    }
  };

  return (
    <Card className="border border-border bg-card/80 backdrop-blur-xl shadow-xl">
      <CardContent className="p-6">
        <div className="space-y-2 mb-4">
          <div className="text-3xl font-bold text-white">
            {formatPackagePrice(totalPrice)}
          </div>
          <p className="text-sm text-zinc-400">
            Total package price · covers up to {numberOfPersons}{" "}
            {numberOfPersons === 1 ? "traveler" : "travelers"}
          </p>
          <p className="text-xs text-amber-500/90 font-medium">
            Effective price per person: {formatPackagePrice(pricePerPerson)}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {plans.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1.5 block text-zinc-300">
                Select Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 hover:border-amber-500/30 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 cursor-pointer"
              >
                {plans.map((plan) => (
                  <option
                    key={plan.name}
                    value={plan.name}
                    className="bg-zinc-950 text-white"
                  >
                    {plan.name} — {formatPlanCapacity(plan.price, plan.numberOfPersons)}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* <div>
            <label className="text-sm font-medium mb-1.5 block text-zinc-300">
              Travelers
            </label>
            <input
              type="number"
              min={1}
              max={planDetails ? planDetails.numberOfPersons : baseTravelers}
              value={travelers}
              onChange={(e) =>
                setTravelers(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-full bg-zinc-950 border border-white/10 hover:border-amber-500/30 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
            />
            <p className="text-xs text-zinc-500 mt-1.5">
              {planDetails
                ? `This plan includes up to ${planDetails.numberOfPersons} travelers`
                : `Base package includes up to ${baseTravelers} travelers`}
            </p>
          </div> */}
        </div>

        {capacityError && (
          <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/30 rounded-lg px-3 py-2.5 mb-4">
            {capacityError}
          </div>
        )}

        <div className="text-sm text-amber-500 font-semibold mb-4 flex justify-between border-t border-white/5 pt-3">
          <span>Booking total</span>
          <span>{formatPackagePrice(totalPrice)}</span>
        </div>

        <Button
          className="w-full bg-amber-500 hover:bg-amber-600 text-black text-lg py-6 font-semibold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          size="lg"
          asChild={canBook}
          disabled={!canBook}
        >
          {canBook ? (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Book Now on WhatsApp
            </a>
          ) : (
            <span>Adjust travelers to continue</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
