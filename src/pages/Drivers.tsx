import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
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
import { getDrivers, gethistoryofdriverId } from "@/redux/Slice/driverSlice";
import { CustomersHistoryTable } from "@/components/shared/CustomersHistoryTable";

interface Booking {
  id: string;
  date: string;
  pickupTime: string;
  dropLocation: string;
  pickupLocation: string;
  status: string;
  driver_name: string;
  user_firstname: string;
  user_lastname: string;
  // Add other properties as needed
}

export default function Drivers() {
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const drivers = useAppSelector((state) => state.driver.drivers);
  // const driverHistoryResponse = useAppSelector((state) => state.driver.bookingHistory);
  const currentPage = useAppSelector((state) => state.driver.page || 1);
  const totalPages = useAppSelector((state) => state.driver.total_pages || 1);
  const [localPage, setLocalPage] = useState(currentPage);
  const dispatch = useDispatch<AppDispatch>();
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Properly extract bookings from response
  const driverHistory = useAppSelector((state)=>state.driver.bookingHistory)
  
  const handleDriverAdded = () => {
    setIsAddDriverOpen(false);
    dispatch(getDrivers({ page: currentPage, limit, search: searchQuery }));
  };

  useEffect(() => {
    console.log("Fetching drivers...");
    dispatch(getDrivers({ page: localPage, limit, search: searchQuery }));
  }, [dispatch, localPage, limit, searchQuery]);

  useEffect(() => {
    if (selectedDriverId) {
      setLoadingHistory(true);
      setHistoryError(null);
      // Clear previous history before fetching new one
      // dispatch(clearBookingHistory());
      
      dispatch(gethistoryofdriverId({ driverId: selectedDriverId }))
        .unwrap()
        .then((response) => {
          console.log('API Response:', response); // Debug log
          if (!response.success) {
            setHistoryError("Failed to fetch booking history");
          } else if (!response.message || response.message.length === 0) {
            setHistoryError("No trips found for this driver");
          }
        })
        .catch((error) => {
          console.error('API Error:', error); // Debug log
          setHistoryError("Failed to load booking history");
        })
        .finally(() => setLoadingHistory(false));
    }
  }, [dispatch, selectedDriverId]);

  const handlePageChange = (newPage: number) => {
    setLocalPage(newPage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLocalPage(1); // Reset to first page when searching
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
          onEdit={(driver) => console.log("Editing driver", driver)}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          loading={loading}
        />

      {selectedDriverId && (
  <div>
    <h3 className="text-lg font-semibold text-taxi-blue mt-8 mb-2">
      Trip History for {drivers.find((d) => d.id === selectedDriverId)?.name}
    </h3>

    {loadingHistory ? (
      <div className="flex justify-center py-4">Loading booking history...</div>
    ) : historyError ? (
      <div className="text-red-500 text-center py-4">{historyError}</div>
    ) : driverHistory.length === 0 ? (
      <div className="text-gray-500 text-center py-4">
        No trips found for this driver
      </div>
    ) : (
     <CustomersHistoryTable 
     list={driverHistory}/>
    )}
  </div>
)}

      </div>
    </PageContainer>
  );
}