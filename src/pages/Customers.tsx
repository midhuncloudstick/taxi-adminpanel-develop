import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CustomersTable } from "@/components/shared/CustomersTable";
import { BookingsTable } from "@/components/shared/BookingsTable";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { listBookingBycustomerId, listCustomerUsers } from "@/redux/Slice/customerSlice";
import { useAppSelector } from "@/redux/hook";
import { Booking } from "@/types/booking";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Customers() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState(""); // <-- Add search state

  const dispatch = useDispatch<AppDispatch>();
  const customerlist = useAppSelector((state) => state.customer.customers);

  useEffect(() => {
    dispatch(listCustomerUsers());
  }, [dispatch]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (selectedCustomerId) {
        const result = await dispatch(listBookingBycustomerId(selectedCustomerId));
        if ('payload' in result && Array.isArray(result.payload)) {
          setSelectedBookings(result.payload);
        } else {
          setSelectedBookings([]);
        }
      } else {
        setSelectedBookings([]);
      }
    };
    fetchBookings();
  }, [selectedCustomerId, dispatch]);

const filteredCustomers = Array.isArray(customerlist)
  ? customerlist.filter(c =>
      c.username?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase())
    )
  : [];


  return (
    <PageContainer title="Customer Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Customers</h2>
          <p className="text-sm text-gray-500">View and manage customer information.</p>
        </div>
        <div className="mb-4">
          <Search className="absolute left-3 text-gray-400" size={18} />
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
              Past Trips for {customerlist.find(c => c.id === selectedCustomerId)?.username}
            </h3>
            <BookingsTable bookings={selectedBookings as any} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}