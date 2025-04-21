
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { customers, getBookingsByCustomerId, Booking } from "@/data/mockData";
import { CustomersTable } from "@/components/shared/CustomersTable";
import { BookingsTable } from "@/components/shared/BookingsTable";

export default function Customers() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const selectedBookings: Booking[] = selectedCustomerId
    ? getBookingsByCustomerId(selectedCustomerId)
    : [];

  return (
    <PageContainer title="Customer Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Customers</h2>
          <p className="text-sm text-gray-500">View and manage customer information.</p>
        </div>
        <CustomersTable
          customers={customers}
          selectedId={selectedCustomerId}
          onSelect={setSelectedCustomerId}
        />
        {selectedCustomerId && (
          <div>
            <h3 className="text-lg font-semibold text-taxi-blue mt-8 mb-2">
              Past Trips for {customers.find(c => c.id === selectedCustomerId)?.name}
            </h3>
            <BookingsTable bookings={selectedBookings} showDriver />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
