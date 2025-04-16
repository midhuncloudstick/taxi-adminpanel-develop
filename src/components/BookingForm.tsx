import React, { useState, useNavigate } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { 
  CalendarIcon, 
  Clock, 
  LucideMapPin, 
  Users, 
  Briefcase, 
  Baby,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import VehicleSelection from './VehicleSelection';

type BookingType = 'instant' | 'scheduled';

const BookingForm = () => {
  const [bookingType, setBookingType] = useState<BookingType>('instant');
  const [date, setDate] = useState<Date>();
  const [showVehicles, setShowVehicles] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search-results', { 
      state: {
        from: document.getElementById('from')?.value,
        to: document.getElementById('to')?.value
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
            {/* From Location */}
            <div className="space-y-2">
              <Label htmlFor="from">From Location</Label>
              <div className="relative">
                <LucideMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="from" 
                  placeholder="Enter pickup location" 
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* To Location */}
            <div className="space-y-2">
              <Label htmlFor="to">To Location</Label>
              <div className="relative">
                <LucideMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="to" 
                  placeholder="Enter destination" 
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Pickup Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                      disabled={bookingType === 'instant'}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => {
                        // Disable dates in the past
                        const now = new Date();
                        now.setHours(0, 0, 0, 0);
                        return date < now;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Pickup Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select disabled={bookingType === 'instant'}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="06:30">6:30 AM</SelectItem>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="07:30">7:30 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="08:30">8:30 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      {/* Add more time slots as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Passengers and Luggage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Passengers</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Passenger</SelectItem>
                      <SelectItem value="2">2 Passengers</SelectItem>
                      <SelectItem value="3">3 Passengers</SelectItem>
                      <SelectItem value="4">4 Passengers</SelectItem>
                      <SelectItem value="5">5 Passengers</SelectItem>
                      <SelectItem value="6">6 Passengers</SelectItem>
                      <SelectItem value="7+">7+ Passengers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Luggage</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Luggage</SelectItem>
                      <SelectItem value="1">1 Piece</SelectItem>
                      <SelectItem value="2">2 Pieces</SelectItem>
                      <SelectItem value="3">3 Pieces</SelectItem>
                      <SelectItem value="4">4 Pieces</SelectItem>
                      <SelectItem value="5+">5+ Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Children and Baby Seats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Children</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Children</SelectItem>
                    <SelectItem value="1">1 Child</SelectItem>
                    <SelectItem value="2">2 Children</SelectItem>
                    <SelectItem value="3">3 Children</SelectItem>
                    <SelectItem value="4+">4+ Children</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Baby Seats</Label>
                <div className="relative">
                  <Baby className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="1">1 Seat</SelectItem>
                      <SelectItem value="2">2 Seats</SelectItem>
                      <SelectItem value="3+">3+ Seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              {bookingType === 'instant' ? 'Book Now' : 'Find Vehicles'}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Show vehicle selection after search */}
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
