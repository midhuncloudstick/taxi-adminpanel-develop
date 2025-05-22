
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
  const [selectedCustomerId, setSelectedCustomerId] = useState<any | null>(null);

  // const selectedBookings: Booking[] = selectedCustomerId
  //   ? listBookingBycustomerId(selectedCustomerId)
  //   : [];

const dispatch = useDispatch<AppDispatch>()
const customerlist = useAppSelector((state)=>state.customer.selectedCustomers)

useEffect(()=>{
  dispatch(listCustomerUsers())
},[dispatch])



useEffect(()=>{
  dispatch(listBookingBycustomerId())
},[dispatch])

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
            {/* <BookingsTable bookings={selectedBookings} showDriver /> */}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
