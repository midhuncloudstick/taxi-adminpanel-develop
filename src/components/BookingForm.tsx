
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import LocationInputs from './booking/LocationInputs';
import DateTimeSelector from './booking/DateTimeSelector';
import PassengersAndLuggage from './booking/PassengersAndLuggage';
import ChildrenAndBabySeats from './booking/ChildrenAndBabySeats';
import VehicleSelection from './VehicleSelection';

type BookingType = 'instant' | 'scheduled';

const BookingForm = () => {
  const [bookingType, setBookingType] = useState<BookingType>('instant');
  const [date, setDate] = useState<Date>();
  const [showVehicles, setShowVehicles] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search-results', { 
      state: {
        from: fromLocation,
        to: toLocation
      }
    });
  };

  return (
    <Card className="w-full bg-background/95 backdrop-blur shadow-lg border-primary/10">
      <CardHeader className="pb-4">
        <Tabs defaultValue="instant" className="w-full" onValueChange={(value) => setBookingType(value as BookingType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instant">Instant Booking</TabsTrigger>
            <TabsTrigger value="scheduled">Schedule a Ride</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch}>
          <div className="space-y-4">
            <LocationInputs
              fromLocation={fromLocation}
              toLocation={toLocation}
              onFromLocationChange={setFromLocation}
              onToLocationChange={setToLocation}
            />
            
            <DateTimeSelector
              date={date}
              onDateSelect={setDate}
              bookingType={bookingType}
            />

            <PassengersAndLuggage />

            <ChildrenAndBabySeats />

            <Button type="submit" className="w-full">
              {bookingType === 'instant' ? 'Book Now' : 'Find Vehicles'}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </form>

        {showVehicles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <VehicleSelection />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingForm;
