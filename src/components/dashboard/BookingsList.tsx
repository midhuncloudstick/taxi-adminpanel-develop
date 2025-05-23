
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "./BookingCard";
import { Booking, bookings } from "@/data/mockData";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getBookinglist } from "@/redux/Slice/bookingSlice";

export function BookingsList() {
  const [bookingsData, setBookingsData] = useState<Booking[]>(bookings);
  
  const pendingBookings = bookingsData.filter(booking => booking.status === "pending");
  const waitingBookings = bookingsData.filter(booking => booking.status === "waiting for confirmation");
  const upcomingBookings = bookingsData.filter(booking => booking.status === "upcoming");
  const completedBookings = bookingsData.filter(booking => booking.status === "completed");
  const cancelledBookings = bookingsData.filter(booking => booking.status === "cancelled");

// const dispatch = useDispatch<AppDispatch>()

// useEffect(()=>{
//   dispatch(getBookinglist())
// },[dispatch])


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
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="pending" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="waiting" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Waiting ({waitingBookings.length})
          </TabsTrigger>
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
        
        <TabsContent value="pending" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onUpdateDriver={handleUpdateDriver}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="waiting" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {waitingBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onUpdateDriver={handleUpdateDriver}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        </TabsContent>
        
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
