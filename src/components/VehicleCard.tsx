import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Check, Users, Briefcase } from 'lucide-react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

interface Vehicle {
  id: number;
  name: string;
  image: string;
  price: number;
  passengers: number;
  luggage: number;
  features: string[];
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking-details', { state: { vehicle } });
  };

  return (
    <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Vehicle Image */}
          <div className="md:col-span-3 h-48 md:h-full">
            <img 
              src={vehicle.image} 
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Vehicle Details */}
          <div className="md:col-span-6 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Available Now
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{vehicle.passengers} passengers</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4" />
                  <span>{vehicle.luggage} luggage</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Check className="mr-1.5 h-3 w-3 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Price and Book Button */}
          <div className="md:col-span-3 bg-muted/30 p-4 flex flex-col justify-between">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-primary">${vehicle.price}</div>
              <div className="text-sm text-muted-foreground">Total fare</div>
            </div>
            
            <Button className="w-full" onClick={handleBookNow}>
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
