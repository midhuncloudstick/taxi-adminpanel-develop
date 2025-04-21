
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { drivers, getBookingsByDriverId, Booking } from "@/data/mockData";
import { DriversTable } from "@/components/shared/DriversTable";
import { BookingsTable } from "@/components/shared/BookingsTable";

export default function Drivers() {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const selectedTrips: Booking[] = selectedDriverId
    ? getBookingsByDriverId(selectedDriverId)
    : [];

  return (
    <PageContainer title="Driver Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Drivers</h2>
          <p className="text-sm text-gray-500">View and manage driver information.</p>
        </div>
        <DriversTable
          drivers={drivers}
          selectedId={selectedDriverId}
          onSelect={setSelectedDriverId}
        />
        {selectedDriverId && (
          <div>
            <h3 className="text-lg font-semibold text-taxi-blue mt-8 mb-2">
              Trip History for {drivers.find(d => d.id === selectedDriverId)?.name}
            </h3>
            <BookingsTable bookings={selectedTrips} showCustomer />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
