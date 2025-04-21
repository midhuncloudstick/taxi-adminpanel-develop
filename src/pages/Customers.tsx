
import { PageContainer } from "@/components/layout/PageContainer";

export default function Customers() {
  return (
    <PageContainer title="Customer Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Customers</h2>
          <p className="text-sm text-gray-500">View and manage customer information</p>
        </div>
        
        <div className="bg-white p-12 rounded-lg shadow flex items-center justify-center">
          <p className="text-gray-500">Customer management interface coming soon...</p>
        </div>
      </div>
    </PageContainer>
  );
}
