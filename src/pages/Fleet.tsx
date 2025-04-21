
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Sample vehicle data
const vehicles = [
  {
    id: 1,
    name: "Premium Sedan",
    image: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533",
    price: 89,
    passengers: 3,
    luggage: 3,
    kilometers: 150,
    features: ["Free waiting time", "Flight tracking", "Meet & greet"],
    description: "Ideal for business trips and airport transfers.",
  },
  {
    id: 2,
    name: "Business SUV",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533",
    price: 119,
    passengers: 5,
    luggage: 5,
    kilometers: 200,
    features: ["Free waiting time", "Flight tracking", "Meet & greet", "Child seat available"],
    description: "Spacious comfort for groups and families.",
  },
  {
    id: 3,
    name: "Luxury Van",
    image: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533",
    price: 149,
    passengers: 7,
    luggage: 7,
    kilometers: 250,
    features: ["Free waiting time", "Flight tracking", "Meet & greet", "WiFi", "Refreshments"],
    description: "Perfect for events and airport shuttles.",
  }
];

const Fleet = () => {
  const handleBookNow = (vehicleName: string) => {
    toast({
      title: "Booking feature coming soon!",
      description: `Booking for ${vehicleName} is coming soon.`
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 px-2">
        <div className="mx-auto w-full max-w-[75rem]">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center text-primary">
            Our Fleet
          </h1>
          <p className="max-w-3xl mx-auto mb-8 text-center text-muted-foreground">
            Discover our exclusive fleet. Every vehicle is selected for comfort, luxury, and convenience.
          </p>
          <div className="space-y-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col md:flex-row bg-card rounded-lg border border-border overflow-hidden shadow-sm 
                           md:items-stretch"
              >
                {/* Vehicle image */}
                <div className="md:w-1/4 w-full h-56 md:h-auto flex-shrink-0">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Vehicle info */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <span className="text-lg font-semibold">{vehicle.name}</span>
                      <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded font-medium border border-primary/20">Available Now</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{vehicle.description}</p>
                    <div className="flex gap-8 text-muted-foreground mb-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4 mr-1 text-primary" />
                        {vehicle.passengers} Passengers
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Luggage className="w-4 h-4 mr-1 text-primary" />
                        {vehicle.luggage} Luggage
                      </div>
                    </div>
                  </div>
                </div>
                {/* Price/Book */}
                <div className="md:w-52 bg-muted/40 flex flex-col items-center justify-center px-6 py-8 md:py-0 border-t md:border-t-0 md:border-l border-border">
                  <div>
                    <div className="text-2xl font-bold text-primary text-center mb-1">
                      ${vehicle.price}
                    </div>
                    <div className="text-xs text-muted-foreground text-center">Starting Fare</div>
                    <div className="text-xs text-muted-foreground text-center mt-1">
                      {vehicle.kilometers} km included
                    </div>
                  </div>
                  <Button 
                    className="mt-5 w-full"
                    onClick={() => handleBookNow(vehicle.name)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
};

export default Fleet;

