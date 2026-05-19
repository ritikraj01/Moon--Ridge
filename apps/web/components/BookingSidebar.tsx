"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Plan {
  name: string;
  price: number;
  features?: string[];
}

interface Package {
  title: string;
  pricing: number;
  plans?: Plan[];
}

interface BookingSidebarProps {
  pkg: Package;
  whatsappNumber: string;
}

export default function BookingSidebar({ pkg, whatsappNumber }: BookingSidebarProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    pkg.plans?.[0]?.name ?? ""
  );
  const [travelers, setTravelers] = useState<number>(2);

  // Find the selected plan details
  const planDetails = pkg.plans?.find((p) => p.name === selectedPlan);
  const pricePerPerson = planDetails ? planDetails.price : pkg.pricing || 0;
  const totalPrice = pricePerPerson * travelers;

  // Build dynamic Whatsapp message
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, "");
  
  let message = `Hi! I want to book the "${pkg.title}" package. `;
  if (selectedPlan) {
    message += `I want to book the "${selectedPlan}" plan for ${travelers} people.`;
  } else {
    message += `I want to book this plan for ${travelers} people.`;
  }

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Card className="border border-border bg-card/80 backdrop-blur-xl shadow-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-baseline mb-2">
          <div className="text-3xl font-bold text-white">₹{pricePerPerson.toLocaleString()}</div>
          <span className="text-sm text-zinc-400">per person</span>
        </div>
        
        {travelers > 0 && (
          <div className="text-sm text-amber-500 font-semibold mb-6 flex justify-between border-t border-white/5 pt-3">
            <span>Total ({travelers} {travelers === 1 ? "traveler" : "travelers"}):</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {pkg.plans && pkg.plans.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1.5 block text-zinc-300">Select Plan</label>
              <select 
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 hover:border-amber-500/30 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 cursor-pointer"
              >
                {pkg.plans.map((plan: Plan) => (
                  <option key={plan.name} value={plan.name} className="bg-zinc-950 text-white">
                    {plan.name} (₹{plan.price?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1.5 block text-zinc-300">Travelers</label>
            <input
              type="number"
              min="1"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-zinc-950 border border-white/10 hover:border-amber-500/30 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
            />
          </div>
        </div>

        <Button
          className="w-full bg-amber-500 hover:bg-amber-600 text-black text-lg py-6 font-semibold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
          asChild
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Now on WhatsApp
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
