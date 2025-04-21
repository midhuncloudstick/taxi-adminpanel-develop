
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Booking } from "@/data/mockData";
import { drivers } from "@/data/mockData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface BookingCardProps {
  booking: Booking;
  onUpdateDriver: (bookingId: string, driverId: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export function BookingCard({ booking, onUpdateDriver, onCancelBooking }: BookingCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDriverChange = (value: string) => {
    onUpdateDriver(booking.id, value);
  };

  const handleCancelClick = () => {
    setIsDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    onCancelBooking(booking.id);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden animate-fade-in">
        <div className="bg-taxi-blue text-white p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">{booking.id}</span>
            <span className="text-sm">•</span>
            <span className="text-sm">{formatDate(booking.date)}</span>
            <span className="text-sm">•</span>
            <span className="text-sm">{booking.pickupTime}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm text-gray-500">Pickup Location</p>
              <p className="font-medium">{booking.pickupLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Drop Location</p>
              <p className="font-medium">{booking.dropLocation}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-medium">{booking.kilometers} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">${booking.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">Assigned Driver</p>
            <Select
              value={booking.driver}
              onValueChange={handleDriverChange}
              disabled={booking.status !== "upcoming"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {booking.status === "upcoming" && (
            <Button 
              variant="outline" 
              className="w-full text-taxi-red border-taxi-red hover:bg-red-50"
              onClick={handleCancelClick}
            >
              Cancel Booking
            </Button>
          )}
        </CardFooter>
      </Card>

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        description={`Are you sure you want to cancel booking ${booking.id}? This action cannot be undone.`}
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep Booking"
      />
    </>
  );
}
