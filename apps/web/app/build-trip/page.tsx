"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CustomTourBuilder() {
  const [hotelType, setHotelType] = useState("standard");
  const [transport, setTransport] = useState("shared");
  const [duration, setDuration] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const basePrice = 10000;
  
  const calculatePrice = () => {
    let price = basePrice;
    if (hotelType === "premium") price += 10000;
    if (hotelType === "luxury") price += 25000;
    
    if (transport === "private") price += 15000;
    
    return (price * duration * travelers).toLocaleString('en-IN');
  };

  const handleRequestQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "custom_quotes"), {
        ...formData,
        tripDetails: {
          duration,
          travelers,
          hotelType,
          transport,
          estimatedPrice: calculatePrice(),
        },
        createdAt: new Date(),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting quote request:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-amber-500">Customize Your Dream Trip</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Card className="bg-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Duration (Days)</label>
                <input 
                  type="range" 
                  min="3" max="15" 
                  value={duration} 
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full accent-amber-500" 
                />
                <div className="text-right mt-1 font-bold">{duration} Days</div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Travelers</label>
                <input 
                  type="number" 
                  min="1" 
                  value={travelers} 
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="w-full bg-background border border-border p-2 rounded-md" 
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Hotel Type</label>
                <div className="flex gap-2">
                  {["standard", "premium", "luxury"].map((type) => (
                    <Button 
                      key={type}
                      variant={hotelType === type ? "default" : "outline"}
                      className={hotelType === type ? "bg-amber-500 text-black hover:bg-amber-600" : ""}
                      onClick={() => setHotelType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Transport</label>
                <div className="flex gap-2">
                  {["shared", "private"].map((type) => (
                    <Button 
                      key={type}
                      variant={transport === type ? "default" : "outline"}
                      className={transport === type ? "bg-amber-500 text-black hover:bg-amber-600" : ""}
                      onClick={() => setTransport(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <div className="sticky top-24">
            <Card className="bg-gradient-to-br from-amber-500/20 to-transparent border-amber-500/30">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-medium mb-4">Estimated Total Price</h3>
                <div className="text-5xl font-bold text-amber-500 mb-6">
                  ₹{calculatePrice()}
                </div>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black py-6 text-lg rounded-full"
                >
                  Request Custom Quote
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Final price may vary based on exact dates and availability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Custom Quote</DialogTitle>
            <DialogDescription>
              Enter your details below and we will get back to you with a personalized itinerary and quote.
            </DialogDescription>
          </DialogHeader>
          
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium">Request Sent Successfully!</h3>
              <p className="text-muted-foreground">Our travel experts will contact you shortly.</p>
              <Button onClick={() => { setIsDialogOpen(false); setIsSuccess(false); }} className="w-full mt-4">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRequestQuote} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210" 
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600 text-black">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
