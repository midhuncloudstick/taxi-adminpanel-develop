import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import {
  getCustomerById
} from "@/data/mockData";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Clock
} from "lucide-react";
import { Button } from "../ui/button";
import { BookingStatusDropdown } from "./BookingStatusDropdown";
import { ChatDialog } from "./ChatDialog";
import { Drivers } from "@/types/driver";
import { Booking } from "@/types/booking";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  AssignDriverthroughEmail,
  AssignDriverthroughSMS,
  getBookinglist
} from "@/redux/Slice/bookingSlice";
import { useAppSelector } from "@/redux/hook";
import {
  listCustomerUsers
} from "@/redux/Slice/customerSlice";
import { getDrivers } from "@/redux/Slice/driverSlice";
import { Customer } from "@/types/customer";

interface BookingsTableProps {
  bookings: Booking[];
  drivers?: Drivers[];
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
}

export function BookingsTable({
  bookings,
  drivers = [],
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
}: BookingsTableProps) {
  const [internalExpandedRows, setInternalExpandedRows] = useState<Record<string, boolean>>({});
  const expandedRows = externalExpandedRows ?? internalExpandedRows;

  const [availableDrivers, setAvailableDrivers] = useState<Drivers[]>([]);
  const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true); // ⬅️ added loading state

  const bookinglist = useAppSelector((state) => state.booking.selectedBooking);
  const customersFromStore = useAppSelector(state => state.customer.customers || []);
  const driversFromStore = useAppSelector(state => state.driver.drivers || []);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // ⬅️ start loading
      await Promise.all([
        dispatch(getBookinglist()),
        dispatch(listCustomerUsers()),
        dispatch(getDrivers())
      ]);
      setLoading(false); // ⬅️ end loading
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setAvailableCustomers(customersFromStore);
  }, [customersFromStore]);

  useEffect(() => {
    setAvailableDrivers(driversFromStore);
  }, [driversFromStore]);

  const toggleRow = (bookingId: string) => {
    if (onExpandRow) {
      onExpandRow(bookingId);
    } else {
      setInternalExpandedRows(prev => ({
        ...prev,
        [bookingId]: !prev[bookingId]
      }));
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US");

  const formatTime = (time: string) => {
    const localTimeString = time.replace(/Z$/, ""); // removes Z if it's there
    return new Date(localTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
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
    if (driverType === "internal") {
      await dispatch(AssignDriverthroughSMS({ driverId, bookingId }));
    } else {
      await dispatch(AssignDriverthroughEmail({ driverId, bookingId }));
    }
    await dispatch(getBookinglist());
    await dispatch(getDrivers());
  };

  const getSortSymbol = (col: string) =>
    sortKey === col ? (sortDirection === "asc" ? "▲" : "▼") : "";

  // ⏳ Loading UI
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
            <TableHead onClick={() => onSort?.("id")} className={onSort ? "cursor-pointer" : ""}>Booking ID {getSortSymbol("id")}</TableHead>
            <TableHead onClick={() => onSort?.("date")} className={onSort ? "cursor-pointer" : ""}>Date {getSortSymbol("date")}</TableHead>
            <TableHead onClick={() => onSort?.("pickupTime")} className={onSort ? "cursor-pointer" : ""}>Pickup Time {getSortSymbol("pickupTime")}</TableHead>
            <TableHead onClick={() => onSort?.("kilometers")} className={onSort ? "cursor-pointer" : ""}>KMs {getSortSymbol("kilometers")}</TableHead>
            <TableHead onClick={() => onSort?.("pickupLocation")} className={onSort ? "cursor-pointer" : ""}>Pickup {getSortSymbol("pickupLocation")}</TableHead>
            <TableHead onClick={() => onSort?.("dropLocation")} className={onSort ? "cursor-pointer" : ""}>Drop {getSortSymbol("dropLocation")}</TableHead>
            {showCustomer && <TableHead onClick={() => onSort?.("customerId")} className={onSort ? "cursor-pointer" : ""}>Customer {getSortSymbol("customerId")}</TableHead>}
            {(showDriver || showDriverSelect) && <TableHead onClick={() => onSort?.("driver")} className={onSort ? "cursor-pointer" : ""}>Driver {getSortSymbol("driver")}</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead onClick={() => onSort?.("amount")} className={onSort ? "cursor-pointer" : ""}>Amount ($) {getSortSymbol("amount")}</TableHead>
            <TableHead>Chat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(bookinglist) && bookinglist.map((b) => {
            const customer = getCustomerById(b.customerId);

            return (
              <React.Fragment key={b.id}>
                <TableRow id={`booking-row-${b.id}`} className={expandedRows?.[b.id] ? "border-b-0" : ""}>
                  <TableCell className="p-2 text-center">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleRow(b.id)}>
                      {expandedRows?.[b.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{b.id}</TableCell>
                  <TableCell>{formatDate(b.date)}</TableCell>
                  <TableCell>{formatTime(b.pickupTime)}</TableCell>
                  <TableCell>{b.kilometers}</TableCell>
                  <TableCell>{b.pickupLocation}</TableCell>
                  <TableCell>{b.dropLocation}</TableCell>
                  {showCustomer && (
                    <TableCell>{b.user_firstname + " " + b.user_lastname}</TableCell>
                  )}
                  {showDriverSelect ? (
                    <TableCell>
                      <Select
                        value={b.driverId?.toString() || ""}
                        onValueChange={val => {
                          const selectedDriver = availableDrivers.find(d => d.id?.toString() === val);
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
                            {availableDrivers.find(d => d.id?.toString() === b.driverId?.toString())?.name || ""}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {availableDrivers.filter(d => d.status === "active").map(d => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  ) : showDriver ? (
                    <TableCell>
                      {availableDrivers.find(d => d.id?.toString() === b.driverId?.toString())?.name || "No Driver"}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <BookingStatusDropdown
                      bookingId={b.id}
                      status={b.status as "requested"| "assigned driver"|"pickup"|"waiting for driver confirmation" | "journey started"| "journey completed"|"cancelled"}
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
                        <h4 className="font-medium text-lg">Booking Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-taxi-blue" />
                              <span className="font-medium">Date:</span> {formatDate(b.date)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-taxi-blue" />
                              <span className="font-medium">Time:</span> {formatTime(b.pickupTime)}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-taxi-blue" />
                              <span className="font-medium">Pickup:</span> {b.pickupLocation}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-taxi-blue" />
                              <span className="font-medium">Destination:</span> {b.dropLocation}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {customer && (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Customer:</span> {customer.name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Phone:</span> {customer.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Email:</span> {customer.email}
                                </div>
                              </>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Distance:</span> {b.kilometers} km
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Fare:</span> ${b.amount.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        {b.specialRequest && (
                          <div className="mt-2">
                            <span className="font-medium">Notes:</span> {b.specialRequest}
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
    </div>
  );
}
