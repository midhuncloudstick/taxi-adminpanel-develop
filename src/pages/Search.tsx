
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchBar } from "@/components/ui/SearchBar";

export default function Search() {
  return (
    <PageContainer title="Search">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Search</h2>
          <p className="text-sm text-gray-500">Search for bookings, customers, or drivers</p>
        </div>
        
        <SearchBar 
          placeholder="Search by booking ID, customer name, or driver..." 
          className="max-w-2xl"
        />
        
        <div className="bg-white p-12 rounded-lg shadow flex items-center justify-center">
          <p className="text-gray-500">Enter search terms to find results</p>
        </div>
      </div>
    </PageContainer>
  );
}
