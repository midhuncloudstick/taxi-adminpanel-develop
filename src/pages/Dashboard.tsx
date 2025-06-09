
import { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { BookingsTable } from "@/components/shared/BookingsTable";
import { bookings, drivers } from "@/data/mockData";
import { BookingsFilterBar } from "@/components/dashboard/BookingsFilterBar";
import {Drivers} from '@/types/driver'
import { Car, UserCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAvailableCars } from "@/redux/Slice/fleetSlice";
import { getAvailableDrivers } from "@/redux/Slice/driverSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { sortingInBooking, updatefilterstate } from "@/redux/Slice/bookingSlice";

// Utility: sort bookings
function sortBookings(bookings, sortKey, sortDirection) {
  const sorted = [...bookings].sort((a, b) => {
    if (sortKey === "amount" || sortKey === "kilometers") {
      return sortDirection === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
    }
    // For strings/dates
    return sortDirection === "asc"
      ? String(a[sortKey]).localeCompare(String(b[sortKey]))
      : String(b[sortKey]).localeCompare(String(a[sortKey]));
  });
  return sorted;
}

export default function Dashboard() {
  // FILTER & SORT state

  const dispatch = useDispatch<AppDispatch>();

  const [status, setStatus] = useState<"requested" | "waiting for driver confirmation" | "assigned driver" | "pickup" | "journey started" | "journey completed" | "cancelled"|"all">("all");
  const [driver, setDriver] = useState("all");
  const [location, setLocation] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [sortKey, setSortKey] = useState<null | string>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [page,setpage] =useState(1)







  

  // Table column sorting handler
  const handleSort = (column: string) => {
    if (sortKey === column) {
      setSortDirection(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(column);
      setSortDirection("asc");
    }
  };

  // Type-safe setStatus handler
  const handleSetStatus = (value: string) => {
    setpage(1)
    setStatus(value as "requested" | "waiting for driver confirmation" | "assigned driver" | "pickup" | "journey started" | "journey completed" | "cancelled");
  };

 

useEffect(()=>{
  console.log('yes');
  console.log(page);
  
   dispatch(updatefilterstate({
     page:page,
  customerId:customerId,
  location:location,
  driver:driver,
  status:status
  }))
},[status, driver, location, customerId,page])

  useEffect(() => {
  const controller = new AbortController();
  const delayDebounce = setTimeout(() => {
   getlist({optpage:1})
  }, 400); // 400ms debounce
  return () => {
    controller.abort(); // cancels previous request
    clearTimeout(delayDebounce);
  };
  
  }, [dispatch, status, driver, location, customerId,])
  
const getlist = async ({ optpage }: { optpage?: number } = {}) => {
  try {
    await dispatch(
      sortingInBooking({
        status,
        driver,
        search: location,
        customerID: customerId,
        bookingId: "",
        date: "",
        pickup_time: "",
        page: optpage ?? page,
        limit: 10,
      })
    );
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  }
};



  return (
    <PageContainer title="">
     
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-taxi-blue">Bookings</h3>
          <BookingsFilterBar
            status={status}
            driver={driver}
            location={location}
            customerId={customerId}
            setStatus={handleSetStatus}
            setDriver={setDriver}
            setLocation={setLocation}
            setCustomerId={setCustomerId}
            drivers={drivers}
             setpage={setpage}
            showPending
          />
          <BookingsTable
           // bookings={filteredBookings}
            // drivers={driver}
          page={page}
          setpage={setpage}
          status={status}
            driver={driver}
            location={location}
            customerId={customerId}
            setStatus={handleSetStatus}
            setDriver={setDriver}
            setLocation={setLocation}
            setCustomerId={setCustomerId}
            getlist ={getlist}
            showCustomer
            showDriverSelect
          
           
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </PageContainer>
  );
}
