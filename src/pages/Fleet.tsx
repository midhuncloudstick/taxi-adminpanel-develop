
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";

// Use the same sample data and vehicle structure as /search-results & VehicleSelection.
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
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="container-custom flex-1 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center text-primary">
          Our Fleet
        </h1>
        <p className="max-w-2xl mx-auto mb-8 text-center text-muted-foreground">
          Discover our exclusive fleet. Every vehicle is selected for comfort, luxury, and convenience.
        </p>
        <div className="space-y-6 max-w-4xl mx-auto">
          {vehicles.map((vehicle, idx) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Fleet;

