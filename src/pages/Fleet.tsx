
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CarFront, CarTaxiFront, BusFront, Users, Luggage } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const vehicles = [
  {
    name: "Premium Sedan",
    image: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533",
    icon: <CarFront size={34} className="text-primary" />,
    price: 89,
    passengers: 3,
    luggage: 3,
    description: "Ideal for business trips and airport transfers.",
    color: "from-purple-100 to-white",
  },
  {
    name: "Business SUV",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533",
    icon: <CarTaxiFront size={34} className="text-purple-700" />,
    price: 119,
    passengers: 5,
    luggage: 5,
    description: "Spacious comfort for groups and families.",
    color: "from-blue-50 to-white",
  },
  {
    name: "Luxury Van",
    image: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533",
    icon: <BusFront size={34} className="text-blue-600" />,
    price: 149,
    passengers: 7,
    luggage: 7,
    description: "Perfect for events and airport shuttles.",
    color: "from-pink-100 to-white",
  },
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
          Choose from our premium, business, and luxury vehicles for your next trip.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map((v, idx) => (
            <Card key={idx} className={`shadow-xl bg-gradient-to-b ${v.color} border-border`}>
              <CardHeader className="flex flex-col items-center py-6">
                <div className="mb-3 w-full flex justify-center">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="object-cover rounded-lg max-h-32 w-full"
                    style={{ maxWidth: 234 }}
                  />
                </div>
                <div className="mb-2">{v.icon}</div>
                <CardTitle className="text-xl text-center">{v.name}</CardTitle>
                <CardDescription className="mt-1 text-center">{v.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-6">
                <div className="flex gap-3 mb-3">
                  <Badge variant="outline" className="text-xs flex items-center gap-1"><Users size={14} />{v.passengers} Passengers</Badge>
                  <Badge variant="outline" className="text-xs flex items-center gap-1"><Luggage size={14} />{v.luggage} Luggage</Badge>
                </div>
                <div className="text-2xl font-bold mb-2 text-primary">${v.price}</div>
                <div className="text-sm text-muted-foreground mb-4">Starting fare</div>
                <Button variant="default" className="w-full max-w-xs" disabled>
                  Book This
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Fleet;
