
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "./BookingCard";
import { Booking, bookings } from "@/data/mockData";

export function BookingsList() {
  const [bookingsData, setBookingsData] = useState<Booking[]>(bookings);
  
  const upcomingBookings = bookingsData.filter(booking => booking.status === "upcoming");
  const completedBookings = bookingsData.filter(booking => booking.status === "completed");
  const cancelledBookings = bookingsData.filter(booking => booking.status === "cancelled");

  const handleUpdateDriver = (bookingId: string, driverId: string) => {
    setBookingsData(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId ? { ...booking, driver: driverId } : booking
      )
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookingsData(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-taxi-blue">Bookings</h2>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Completed ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcomingBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onUpdateDriver={handleUpdateDriver}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {completedBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onUpdateDriver={handleUpdateDriver}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cancelledBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onUpdateDriver={handleUpdateDriver}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
