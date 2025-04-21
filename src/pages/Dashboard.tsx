
import { PageContainer } from "@/components/layout/PageContainer";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { BookingsList } from "@/components/dashboard/BookingsList";
import { BookingsTable } from "@/components/shared/BookingsTable";
import { bookings } from "@/data/mockData";

export default function Dashboard() {
  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        <StatsCards />
        <BookingsList />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-taxi-blue">All Bookings (Table)</h3>
          <BookingsTable bookings={bookings} showCustomer showDriver />
        </div>
      </div>
    </PageContainer>
  );
}
