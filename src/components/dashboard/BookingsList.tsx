
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "./BookingCard";
import { Booking, bookings } from "@/data/mockData";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getBookinglist } from "@/redux/Slice/bookingSlice";




export function BookingsList() {
  const [bookingsData, setBookingsData] = useState<Booking[]>(bookings);
  const requestedBookings = bookingsData.filter(booking => booking.status === "requested");
  const driverwaitingBookings = bookingsData.filter(booking => booking.status === "waiting for driver confirmation");
  const assigneddriverBookings = bookingsData.filter(booking => booking.status === "driver assigned"); // <-- match your type!
  const completedBookings = bookingsData.filter(booking => booking.status === " journey completed");
  const pickupBookings = bookingsData.filter(booking => booking.status === "pickup");
  const cancelledBookings = bookingsData.filter(booking => booking.status === "cancelled");
  const startedBookings = bookingsData.filter(booking => booking.status === "journey started");

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
          <TabsTrigger value="requested" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            requested ({requestedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="waiting" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Waiting ({driverwaitingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="assigned" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            assigned Driver ({assigneddriverBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Journey Completed ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="started" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Journey Started ({startedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="picup" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Pickup ({pickupBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-taxi-teal data-[state=active]:text-white">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {requestedBookings.map(booking => (
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
            {driverwaitingBookings.map(booking => (
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
            {assigneddriverBookings.map(booking => (
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

        <TabsContent value="completed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {startedBookings.map(booking => (
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
            {pickupBookings.map(booking => (
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
