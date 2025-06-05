import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getCustomerById } from "@/data/mockData";
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { BookingStatusDropdown } from "./BookingStatusDropdown";
import { ChatDialog } from "./ChatDialog";
// import { Drivers } from "@/types/driver";
import { Booking } from "@/types/booking";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  AssignDriverthroughEmail,
  AssignDriverthroughSMS,
  sortingInBooking,
} from "@/redux/Slice/bookingSlice";
import { useAppSelector } from "@/redux/hook";
import { listCustomerUsers } from "@/redux/Slice/customerSlice";
import { getDrivers } from "@/redux/Slice/driverSlice";
import { Customer } from "@/types/customer";
import { clearnotification } from "@/redux/Slice/notificationSlice";
import Search from "@/pages/Search";
import { Pagination } from "../ui/paginationNew";
import { Drivers } from "@/types/driver";

interface BookingsTableProps {
  showCustomer?: boolean;
  showDriver?: boolean;
  showDriverSelect?: boolean;
  onUpdateDriver?: (bookingId: string, driverId: string) => void;
  onUpdateStatus?: (bookingId: string, newStatus: Booking["status"]) => void;
  onSort?: (col: string) => void;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc";
  expandedRows?: Record<string, boolean>;
  onExpandRow?: (id: string) => void;
   
  status?: string;
  driver?: string;
  location?: string;
  customerId?: string;
  setStatus?: (val: string) => void;
  page?: number;
  setpage?: (val: number) => void;
  setDriver?: (val: string) => void;
  setLocation?: (val: string) => void;
  setCustomerId?: (val: string) => void;
  getlist?: () => void;
}

export function BookingsTable({
  showCustomer,
  showDriver,
  showDriverSelect,
  onUpdateDriver,
  onUpdateStatus,
  onSort,
  sortKey,
  sortDirection,
  expandedRows: externalExpandedRows,
  onExpandRow,
   status,
  driver,
  location,
  customerId,
  setStatus,
  setDriver,
  setLocation,
  setCustomerId,
  page,
  setpage,
getlist

}: BookingsTableProps) {
  const [internalExpandedRows, setInternalExpandedRows] = useState<
    Record<string, boolean>
  >({});
  const expandedRows = externalExpandedRows ?? internalExpandedRows;

  const [availableDrivers, setAvailableDrivers] = useState<Drivers[]>([]);
  const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false); // ⬅️ added loading state
 const [searchQuery,setSearchQuery] = useState("")
  const bookinglist = useAppSelector((state) => state.booking.selectedBooking);
  const toggleidfromNotification = useAppSelector(
    (state) => state.notification.toglelistId
  );
  const customersFromStore = useAppSelector(
    (state) => state.customer.customers || []
  );
  const driversFromStore = useAppSelector(
    (state) => state.driver.drivers || []
  );
  const current_Page = useAppSelector((state) => state.booking.page || 1);
  const totalPages = useAppSelector((state) => state.booking.total_pages || 1);
  const [localPage, setLocalPage] = useState(current_Page);
  const dispatch = useDispatch<AppDispatch>();
  const limit = 10;


  useEffect(() => {
    setAvailableCustomers(customersFromStore);
  }, [customersFromStore]);

  useEffect(() => {
    setAvailableDrivers(driversFromStore);
  }, [driversFromStore]);

  useEffect(() => {
    const fetchtoggledata = async () => {
      if (toggleidfromNotification) {
        const findeindex = bookinglist.findIndex((item) => item.id == toggleidfromNotification );
        if (findeindex == -1) {
          const firstid = bookinglist[0].id;
          const differnce =
            Number(firstid.split("-")[1]) -
            Number(toggleidfromNotification.split("-")[1]);
          const itemsPerPage = 10;
          const targetPage = Math.floor(differnce / itemsPerPage) + 1;
          // await Promise.all([
          //   dispatch(
          //     sortingInBooking({
          //       search: "", // or your current search term
          //       customerID: "", // or current customer id filter
          //       status: "", // or current status filter
          //       driver: "", // or current driver filter
          //       bookingId: "", // or current booking id filter
          //       date: "", // or current date filter
          //       pickup_time: "", // or current pickup time filter
          //       page: targetPage==0?1:targetPage,
          //       limit: limit,
          //       // sortBy: sortKey,
          //       // sortOrder: sortDirection,
          //     })
          //   ),
          // ]);
          setDriver('all')
           setCustomerId('')
            setStatus('all')
            setLocation('')
            setpage(targetPage==0?1:targetPage)
        }

         toggleRow(toggleidfromNotification)
      }

     ;
    };
    fetchtoggledata();
  }, [toggleidfromNotification]);


useEffect(()=>{
  setpage(current_Page)
},[current_Page])

  useEffect(() => {
    dispatch(listCustomerUsers({page:current_Page,limit,search:searchQuery})), 
    dispatch(getDrivers({page:current_Page,limit,search:searchQuery}));
  }, []);

  const toggleRow = (bookingId: string) => {
    setInternalExpandedRows((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
    setInterval(() => {
      dispatch(clearnotification(bookingId));
    }, 2000);
  };
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US");

  const formatTime = (time: string) => {
    const localTimeString = time.replace(/Z$/, ""); // removes Z if it's there
    return new Date(localTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const assignDriver = async ({
    driverId,
    bookingId,
    driverType,
  }: {
    driverId: number;
    bookingId: string;
    driverType: "internal" | "external";
  }) => {
    try {
      if (driverType === "internal") {
        await dispatch(AssignDriverthroughSMS({ driverId, bookingId }));
      } else {
        await dispatch(AssignDriverthroughEmail({ driverId, bookingId }));
      }
     getlist()
    } catch (error) {
      console.log("assigned driver error");
    }

  };

  const getSortSymbol = (col: string) =>
    sortKey === col ? (sortDirection === "asc" ? "▲" : "▼") : "";

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      await dispatch(
        sortingInBooking({
          search: location,
          customerID: customerId,
          status: status,
          driver: driver,
          bookingId: "",
          date: "",
          pickup_time: "",
          page: newPage, // Use newPage instead of current_Page
          limit: limit,
          sortBy: sortKey, // Include current sort key
          sortOrder: sortDirection, // Include current sort order
        })
      );
      setLocalPage(newPage); // Update local page state
    } catch (error) {
      console.error("Error changing page:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <span className="text-gray-600 text-lg">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead
              onClick={() => onSort?.("id")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Booking ID {getSortSymbol("id")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("date")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Date {getSortSymbol("date")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("pickupTime")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Pickup Time {getSortSymbol("pickupTime")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("kilometers")}
              className={onSort ? "cursor-pointer" : ""}
            >
              KMs {getSortSymbol("kilometers")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("pickupLocation")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Pickup {getSortSymbol("pickupLocation")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("dropLocation")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Drop {getSortSymbol("dropLocation")}
            </TableHead>
            {showCustomer && (
              <TableHead
                onClick={() => onSort?.("customerId")}
                className={onSort ? "cursor-pointer" : ""}
              >
                Customer {getSortSymbol("customerId")}
              </TableHead>
            )}
            {(showDriver || showDriverSelect) && (
              <TableHead
                onClick={() => onSort?.("driver")}
                className={onSort ? "cursor-pointer" : ""}
              >
                Driver {getSortSymbol("driver")}
              </TableHead>
            )}
            <TableHead>Status</TableHead>
            <TableHead
              onClick={() => onSort?.("amount")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Amount ($) {getSortSymbol("amount")}
            </TableHead>
            <TableHead>Chat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(bookinglist) &&
            bookinglist.map((b) => {
              const customer = getCustomerById(b.customerId);

              return (
                <React.Fragment key={b.id}>
                  <TableRow
                    id={`booking-row-${b.id}`}
                    className={expandedRows?.[b.id] ? "border-b-0" : ""}
                  >
                    <TableCell className="p-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleRow(b.id)}
                      >
                        {expandedRows?.[b.id] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{b.id}</TableCell>
                    <TableCell>{formatDate(b.date)}</TableCell>
                    <TableCell>{formatTime(b.pickupTime)}</TableCell>
                    <TableCell>{b.kilometers}</TableCell>
                    <TableCell>{b.pickupLocation}</TableCell>
                    <TableCell>{b.dropLocation}</TableCell>
                    {showCustomer && (
                      <TableCell>
                        {b.user_firstname + " " + b.user_lastname}
                      </TableCell>
                    )}
                    {showDriverSelect ? (
                      <TableCell>
                        <Select
                          value={b.driverId?.toString() || ""}
                          onValueChange={(val) => {
                            const selectedDriver = availableDrivers.find(
                              (d) => d.id?.toString() === val
                            );
                            if (selectedDriver) {
                              assignDriver({
                                driverId: selectedDriver.id,
                                bookingId: b.id,
                                driverType: selectedDriver.type,
                              });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Driver">
                              {availableDrivers.find(
                                (d) =>
                                  d.id?.toString() === b.driverId?.toString()
                              )?.name || ""}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {availableDrivers
                              .filter((d) => d.status === "active")
                              .map((d) => (
                                <SelectItem key={d.id} value={d.id.toString()}>
                                  {d.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    ) : showDriver ? (
                      <TableCell>
                        {availableDrivers.find(
                          (d) => d.id?.toString() === b.driverId?.toString()
                        )?.name || "No Driver"}
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <BookingStatusDropdown
                        bookingId={b.id}
                        status={
                          b.status as
                            | "requested"
                            | "assigned driver"
                            | "pickup"
                            | "waiting for driver confirmation"
                            | "journey started"
                            | "journey completed"
                            | "cancelled"
                        }
                        getlist={getlist}
                      />
                    </TableCell>
                    <TableCell>${b.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <ChatDialog bookingId={b.id} />
                    </TableCell>
                  </TableRow>
                  {expandedRows?.[b.id] && (
                    <TableRow>
                      <TableCell colSpan={12} className="bg-gray-50 p-0">
                        <div className="p-4 space-y-4">
                          <h4 className="font-medium text-lg">
                            Booking Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={16}
                                  className="text-taxi-blue"
                                />
                                <span className="font-medium">Date:</span>{" "}
                                {formatDate(b.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-taxi-blue" />
                                <span className="font-medium">Time:</span>{" "}
                                {formatTime(b.pickupTime)}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-taxi-blue" />
                                <span className="font-medium">
                                  Pickup:
                                </span>{" "}
                                {b.pickupLocation}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-taxi-blue" />
                                <span className="font-medium">
                                  Destination:
                                </span>{" "}
                                {b.dropLocation}
                              </div>
                            </div>
                            <div className="space-y-2">
                              {customer && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      Customer:
                                    </span>{" "}
                                    {customer.name}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Phone:</span>{" "}
                                    {customer.phone}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Email:</span>{" "}
                                    {customer.email}
                                  </div>
                                </>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Distance:</span>{" "}
                                {b.kilometers} km
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Fare:</span> $
                                {b.amount.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          {b.specialRequest && (
                            <div className="mt-2">
                              <span className="font-medium">Notes:</span>{" "}
                              {b.specialRequest}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
        </TableBody>
      </Table>
      <div className="py-4">
        <Pagination
          currentPage={current_Page}
          itemsPerPage={limit}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
