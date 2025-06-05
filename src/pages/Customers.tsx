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
  
  const [localPage, setLocalPage] = useState(current_Page);
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [customerID, setCustomerID] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    dispatch(listCustomerUsers({ page: current_Page, limit, search: searchQuery }));
  }, [dispatch]);

  const historiesofCustomer = useAppSelector((state) => state.customer.customerhistory)
  // useEffect(() => {
  //   if (customerID) { 
  //     dispatch(customerHistory({
  //       search: "", 
  //       customerID,
  //       page,
  //       limit
  //     }));
  //   }
  // }, [dispatch, customerID, page:current_Page, limit]);


  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      await dispatch(listCustomerUsers({ page: newPage, limit, search: searchQuery }))

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

        <CustomersTable
          customers={filteredCustomers}
          selectedId={selectedCustomerId}
          onSelect={setSelectedCustomerId}
        />

        {selectedCustomerId && (
          <div>
            <h3 className="text-lg font-semibold text-taxi-blue mt-8 mb-2">
              Past Trips for {customerlist.find((c) => c.id === selectedCustomerId)?.username}
            </h3>
            <CustomersHistoryTable
              list={historiesofCustomer}
            />
          </div>
        )}
      </div>

      <Pagination
        currentPage={current_Page}
        itemsPerPage={limit}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

    </PageContainer>
  );
}
