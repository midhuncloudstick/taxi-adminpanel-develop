
import React from 'react';
import { motion } from 'framer-motion';
import VehicleCard from './VehicleCard';

// Sample vehicle data
const vehicles = [
  {
    id: 1,
    name: 'Premium Sedan',
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533',
    price: 89,
    passengers: 3,
    luggage: 3,
    kilometers: 150,
    features: ['Free waiting time', 'Flight tracking', 'Meet & greet']
  },
  {
    id: 2,
    name: 'Business SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533',
    price: 119,
    passengers: 5,
    luggage: 5,
    kilometers: 200,
    features: ['Free waiting time', 'Flight tracking', 'Meet & greet', 'Child seat available']
  },
  {
    id: 3,
    name: 'Luxury Van',
    image: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=533',
    price: 149,
    passengers: 7,
    luggage: 7,
    kilometers: 250,
    features: ['Free waiting time', 'Flight tracking', 'Meet & greet', 'WiFi', 'Refreshments']
  }
];

const VehicleSelection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Select Your Vehicle</h3>
      <div className="space-y-4">
        {vehicles.map((vehicle, index) => (
          <motion.div 
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <VehicleCard vehicle={vehicle} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelection;
