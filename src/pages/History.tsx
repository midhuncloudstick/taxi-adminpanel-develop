
import { PageContainer } from "@/components/layout/PageContainer";
import { getCompletedBookings } from "@/data/mockData";
import { BookingsTable } from "@/components/shared/BookingsTable";

export default function History() {
  const completed = getCompletedBookings();

  return (
    <PageContainer title="Booking History">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Booking History</h2>
          <p className="text-sm text-gray-500">View all historical bookings and trip data.</p>
        </div>
        <BookingsTable bookings={completed} showCustomer showDriver />
      </div>
    </PageContainer>
  );
}
