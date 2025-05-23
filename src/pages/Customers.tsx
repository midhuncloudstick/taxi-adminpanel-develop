
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
// import { customers, getBookingsByCustomerId, Booking } from "@/data/mockData";
import { CustomersTable } from "@/components/shared/CustomersTable";
import { BookingsTable } from "@/components/shared/BookingsTable";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { listBookingBycustomerId, listCustomerUsers } from "@/redux/Slice/customerSlice";
import { useAppSelector } from "@/redux/hook";
import { Booking} from "@/types/booking"



export default function Customers() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Booking[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const customerlist = useAppSelector((state) => state.customer.selectedCustomers);
 const customerhistory = useAppSelector((state)=>state.customer.customers);

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

  return (
    <PageContainer title="Customer Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Customers</h2>
          <p className="text-sm text-gray-500">View and manage customer information.</p>
        </div>
        <CustomersTable
          customers={customerlist}
          selectedId={selectedCustomerId}
          onSelect={setSelectedCustomerId}
        />
        {selectedCustomerId && (
          <div>
            <h3 className="text-lg font-semibold text-taxi-blue mt-8 mb-2">
              Past Trips for {customerlist.find(c => c.id === selectedCustomerId)?.username}
            </h3>
            <BookingsTable bookings={customerhistory as any} />

          </div>
        )}
      </div>
    </PageContainer>
  );
}

