
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookings, cars, drivers, customers } from "@/data/mockData";
import { Car, DollarSign, Calendar, Users } from "lucide-react";

export function StatsCards() {
  const upcomingBookingsCount = bookings.filter(b => b.status === "upcoming").length;
  const availableCarsCount = cars.filter(c => c.status === "available").length;
  const totalRevenue = bookings
    .filter(booking => booking.status !== "cancelled")
    .reduce((sum, booking) => sum + booking.amount, 0);
  const activeDriversCount = drivers.filter(d => d.status === "active").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
      {/* <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Upcoming Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-taxi-teal" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingBookingsCount}</div>
          <p className="text-xs text-gray-500">
            {upcomingBookingsCount > 0 
              ? `Next booking: ${new Date(bookings.find(b => b.status === "upcoming")?.date || "").toLocaleDateString("en-AU")}`
              : "No upcoming bookings"}
          </p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in [animation-delay:150ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Available Cars</CardTitle>
          <Car className="h-4 w-4 text-taxi-teal" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableCarsCount}</div>
          <p className="text-xs text-gray-500">
            {((availableCarsCount / cars.length) * 100).toFixed(0)}% of fleet available
          </p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in [animation-delay:300ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-taxi-teal" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-gray-500">
            From {bookings.filter(b => b.status !== "cancelled").length} completed trips
          </p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in [animation-delay:450ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Active Drivers</CardTitle>
          <Users className="h-4 w-4 text-taxi-teal" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDriversCount}</div>
          <p className="text-xs text-gray-500">
            {((activeDriversCount / drivers.length) * 100).toFixed(0)}% of drivers active
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
}
