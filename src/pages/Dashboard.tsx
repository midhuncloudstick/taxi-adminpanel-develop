
import { PageContainer } from "@/components/layout/PageContainer";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { BookingsList } from "@/components/dashboard/BookingsList";

export default function Dashboard() {
  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        <StatsCards />
        <BookingsList />
      </div>
    </PageContainer>
  );
}
