import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { DriversTable } from "@/components/shared/DriversTable";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function Drivers() {
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedDriverName, setSelectedDriverName] = useState("");
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const drivers = useAppSelector((state) => state.driver.drivers);
  const currentPage = useAppSelector((state) => state.driver.page || 1);
  const totalPages = useAppSelector((state) => state.driver.total_pages || 1);
  const [localPage, setLocalPage] = useState(currentPage);
  const dispatch = useDispatch<AppDispatch>();
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const driverHistory = useAppSelector((state) => state.driver.bookingHistory);

  const handleDriverClick = (driverId: number, driverName: string) => {
    setSelectedDriverId(driverId);
    setSelectedDriverName(driverName);
    setIsHistoryOpen(true);
  };

  const handleDriverAdded = () => {
    setIsAddDriverOpen(false);
    dispatch(getDrivers({ page: 1, limit, search: searchQuery }));
  };

  useEffect(() => {
    dispatch(getDrivers({ page: localPage, limit, search: searchQuery }));
  }, [dispatch, localPage, limit, searchQuery]);

  useEffect(() => {
    if (selectedDriverId && isHistoryOpen) {
      setLoadingHistory(true);
      setHistoryError(null);
      dispatch(gethistoryofdriverId({ driverId: selectedDriverId }))
        .unwrap()
        .then((response) => {
          if (!response.success) {
            setHistoryError("Failed to fetch booking history");
          } else if (!response.message || response.message.length === 0) {
            setHistoryError("No trips found for this driver");
          }
        })
        .catch((error) => {
          setHistoryError("Failed to load booking history");
        })
        .finally(() => setLoadingHistory(false));
    }
  }, [dispatch, selectedDriverId, isHistoryOpen]);

  const handlePageChange = (newPage: number) => {
    setLocalPage(newPage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLocalPage(1);
  };

  return (
    <PageContainer title="Driver Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
           <h2 className="text-xl font-semibold">Drivers Management</h2>
            {/* <p className="text-sm text-gray-500">View and manage driver information.</p> */}
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
          onSelect={(id) => {
            const driver = drivers.find(d => d.id === id);
            if (driver) {
              handleDriverClick(id, driver.name);
            }
          }}
          onEdit={(driver) => console.log("Editing driver", driver)}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          loading={loading}
        />

        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-taxi-blue">
                Trip History for {selectedDriverName}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-6">
              {loadingHistory ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : historyError ? (
                <div className="text-red-500 text-center py-8">{historyError}</div>
              ) : driverHistory && driverHistory.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No trips found for this driver
                </div>
              ) : (
                <CustomersHistoryTable list={driverHistory} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}