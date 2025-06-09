import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CustomersTable } from "@/components/shared/CustomersTable";
import { BookingsTable } from "@/components/shared/BookingsTable";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { customerHistory, listBookingBycustomerId, listCustomerUsers } from "@/redux/Slice/customerSlice";
import { useAppSelector } from "@/redux/hook";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/paginationNew";
import { CustomersHistoryTable } from "@/components/shared/CustomersHistoryTable";

export default function Customers() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const customerlist = useAppSelector((state) => state.customer.customers);
  const allBookings = useAppSelector((state) => state.booking.booking);
  const current_Page = useAppSelector((state) => state.customer.page || 1);
  const totalPages = useAppSelector((state) => state.customer.total_pages || 1);
  const historiesofCustomer = useAppSelector((state) => state.customer.customerhistory);
  
  const [localPage, setLocalPage] = useState(current_Page);
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [customerID, setCustomerID] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(listCustomerUsers({ page: current_Page, limit, search: searchQuery }));
  }, [dispatch, current_Page, limit, searchQuery]);

  useEffect(() => {
    if (selectedCustomerId) {
      dispatch(listBookingBycustomerId(Number(selectedCustomerId)));
    }
  }, [dispatch, selectedCustomerId]);

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      await dispatch(listCustomerUsers({ page: newPage, limit, search: searchQuery }));
      setLocalPage(newPage);
    } catch (error) {
      console.error("Error changing page:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on search
  const filteredCustomers = Array.isArray(customerlist)
    ? customerlist.filter((c) =>
      c.username?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  // Filter bookings for selected customer
  const filteredBookings = selectedCustomerId
    ? Array.isArray(allBookings)
      ? allBookings.filter((booking) => booking.customerId === selectedCustomerId)
      : []
    : [];

  return (
    <PageContainer title="Customer Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Customers</h2>
          <p className="text-sm text-gray-500">View and manage customer information.</p>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 text-sm bg-slate-50 border-slate-200 focus:ring-taxi-teal"
          />
        </div>

        <div className="space-y-4">
          {/* Customers Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <CustomersTable
              customers={filteredCustomers}
              selectedId={selectedCustomerId}
              onSelect={setSelectedCustomerId}
            />
          </div>
          
          {/* Updated Pagination Layout */}
          <div className="flex items-center justify-between">
            {/* Page info on left */}
            <div className="text-sm text-gray-600">
              Page {current_Page} of {totalPages}
            </div>
            
            {/* Navigation buttons on right */}
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, current_Page - 1))}
                disabled={current_Page === 1}
                className="px-3 py-1 text-sm rounded-md bg-taxi-teal text-white disabled:bg-gray-200 disabled:text-gray-500"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, current_Page + 1))}
                disabled={current_Page === totalPages}
                className="px-3 py-1 text-sm rounded-md bg-taxi-teal text-white disabled:bg-gray-200 disabled:text-gray-500"
              >
                Next
              </button>
            </div>
          </div>

          {/* Customer History Section */}
          {selectedCustomerId && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-taxi-blue">
                Past Trips for {customerlist.find((c) => c.id === selectedCustomerId)?.username}
              </h3>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <CustomersHistoryTable
                  list={historiesofCustomer}
                />
              </div>
              
              {/* History Pagination - Only show if needed */}
              {historiesofCustomer?.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {current_Page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, current_Page - 1))}
                      disabled={current_Page === 1}
                      className="px-3 py-1 text-sm rounded-md bg-taxi-teal text-white disabled:bg-gray-200 disabled:text-gray-500"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, current_Page + 1))}
                      disabled={current_Page === totalPages}
                      className="px-3 py-1 text-sm rounded-md bg-taxi-teal text-white disabled:bg-gray-200 disabled:text-gray-500"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}