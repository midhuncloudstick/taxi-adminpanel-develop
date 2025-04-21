
import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { BookingsTable } from "@/components/shared/BookingsTable";
import { bookings, drivers } from "@/data/mockData";
import { BookingsFilterBar } from "@/components/dashboard/BookingsFilterBar";

// Utility: sort bookings
function sortBookings(bookings, sortKey, sortDirection) {
  const sorted = [...bookings].sort((a, b) => {
    if (sortKey === "amount" || sortKey === "kilometers") {
      return sortDirection === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
    }
    // For strings/dates
    return sortDirection === "asc"
      ? String(a[sortKey]).localeCompare(String(b[sortKey]))
      : String(b[sortKey]).localeCompare(String(a[sortKey]));
  });
  return sorted;
}

export default function Dashboard() {
  // FILTER & SORT state
  const [status, setStatus] = useState<"pending" | "upcoming" | "completed" | "cancelled" | "all">("all");
  const [driver, setDriver] = useState("all");
  const [location, setLocation] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [sortKey, setSortKey] = useState<null | string>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [tableBookings, setTableBookings] = useState(bookings);

  // Handler to update driver for a booking
  const handleUpdateDriver = (bookingId: string, driverId: string) => {
    setTableBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, driver: driverId } : b
      )
    );
  };

  // Handler to update status for a booking
  const handleUpdateStatus = (bookingId: string, newStatus: "pending" | "upcoming" | "completed" | "cancelled") => {
    setTableBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      )
    );
  };

  // Filtering logic
  const filteredBookings = useMemo(() => {
    let filtered = tableBookings;
    if (status !== "all") filtered = filtered.filter(b => b.status === status);
    if (driver !== "all") filtered = filtered.filter(b => b.driver === driver);
    if (location)
      filtered = filtered.filter(
        b =>
          b.pickupLocation.toLowerCase().includes(location.toLowerCase()) ||
          b.dropLocation.toLowerCase().includes(location.toLowerCase())
      );
    if (customerId)
      filtered = filtered.filter(b => b.customerId.toLowerCase().includes(customerId.toLowerCase()));
    if (sortKey) filtered = sortBookings(filtered, sortKey, sortDirection);
    return filtered;
  }, [tableBookings, status, driver, location, customerId, sortKey, sortDirection]);

  // Table column sorting handler
  const handleSort = (column: string) => {
    if (sortKey === column) {
      setSortDirection(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column);
      setSortDirection("asc");
    }
  };

  // Type-safe setStatus handler
  const handleSetStatus = (value: string) => {
    setStatus(value as "pending" | "upcoming" | "completed" | "cancelled" | "all");
  };

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        <StatsCards />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-taxi-blue">Bookings</h3>
          <BookingsFilterBar
            status={status}
            driver={driver}
            location={location}
            customerId={customerId}
            setStatus={handleSetStatus}
            setDriver={setDriver}
            setLocation={setLocation}
            setCustomerId={setCustomerId}
            drivers={drivers}
            showPending
          />
          <BookingsTable
            bookings={filteredBookings}
            drivers={drivers}
            showCustomer
            showDriverSelect
            onUpdateDriver={handleUpdateDriver}
            onUpdateStatus={handleUpdateStatus}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </PageContainer>
  );
}
