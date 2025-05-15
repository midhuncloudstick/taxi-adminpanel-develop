
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { drivers, getBookingsByDriverId, Booking } from "@/data/mockData";
import { DriversTable } from "@/components/shared/DriversTable";
import { BookingsTable } from "@/components/shared/BookingsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddDriverForm } from "@/components/drivers/AddDriverForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/redux/hook";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getDrivers } from "@/redux/Slice/driverSlice";

export default function Drivers() {
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  const drivers = useAppSelector((state) => state.driver.drivers)
  const dispatch = useDispatch<AppDispatch>()
  const selectedTrips: Booking[] = selectedDriverId
    ? getBookingsByDriverId(selectedDriverId.toString())
    : [];


  const handleDriverAdded = () => {
    setIsAddDriverOpen(false);
    // In a real app, we would refetch the drivers list here
  };




  return (
    <PageContainer title="Driver Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-taxi-blue">Drivers</h2>
            <p className="text-sm text-gray-500">View and manage driver information.</p>
          </div>
          <Sheet open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
            <SheetTrigger asChild>
              <Button className="bg-taxi-teal hover:bg-taxi-teal/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add New Driver</SheetTitle>
                <SheetDescription>
                  Fill in the details to add a new driver to the system.
                </SheetDescription>
              </SheetHeader>
              <AddDriverForm onSuccess={handleDriverAdded} />
            </SheetContent>
          </Sheet>
        </div>
        <DriversTable
          drivers={drivers}
          selectedId={selectedDriverId}
          onSelect={setSelectedDriverId}
          onEdit={(driver) => {
          console.log("Editing driver", driver);
          }}
        />

        {selectedDriverId && (
          <div>
            <h3 className="text-lg font-semibold text-taxi-blue mt-8 mb-2">
              Trip History for {drivers?.find(d => d.id === selectedDriverId)?.name}
            </h3>
            <BookingsTable bookings={selectedTrips} showCustomer drivers={drivers} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
