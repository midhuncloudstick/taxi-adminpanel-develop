
import { PageContainer } from "@/components/layout/PageContainer";

export default function History() {
  return (
    <PageContainer title="Booking History">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Booking History</h2>
          <p className="text-sm text-gray-500">View all historical bookings and trip data</p>
        </div>
        
        <div className="bg-white p-12 rounded-lg shadow flex items-center justify-center">
          <p className="text-gray-500">Booking history interface coming soon...</p>
        </div>
      </div>
    </PageContainer>
  );
}
