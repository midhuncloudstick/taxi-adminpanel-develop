
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Booking, Driver, getDriverById, getCustomerById } from "@/data/mockData";
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { BookingStatusDropdown } from "./BookingStatusDropdown";
import { ChatDialog } from "./ChatDialog";
import { Drivers } from "@/types/driver";
import { } from "@/types/booking"
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { bookingInChat, getBookinglist, updateBookingStatus } from "@/redux/Slice/bookingSlice";
import { useAppSelector } from "@/redux/hook";
import { listCustomerUsers } from "@/redux/Slice/customerSlice";
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
  sortDirection
}: BookingsTableProps) {
  const getSortSymbol = (col: string) =>
    sortKey === col ? (sortDirection === "asc" ? "▲" : "▼") : "";

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (bookingId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const [availableDrivers, setAvailableDrivers] = useState<Drivers[]>([]);
  const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);
  const bookinglist = useAppSelector((state) => state.booking.selectedBooking)
  const driver = useAppSelector((state) => state.driver.drivers)
  const customer = useAppSelector((state) => state.customer.customers)

  const customersFromStore = useAppSelector(state => state.customer.customers || []);
  const driversFromStore = useAppSelector(state => state.driver.drivers || []);


  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getBookinglist())
  }, [dispatch])



  useEffect(() => {
    dispatch(listCustomerUsers());
  }, [dispatch]);

  // Update local customers state when Redux state changes
  useEffect(() => {
    setAvailableCustomers(customersFromStore);
  }, [customersFromStore]);

  // Fetch drivers once on component mount
  useEffect(() => {
    dispatch(getDrivers());
  }, [dispatch]);

  // Update local drivers state when Redux state changes
  useEffect(() => {
    setAvailableDrivers(driversFromStore);
  }, [driversFromStore]);

  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-US"); // Customize format if needed
  };

  // Format the time (e.g., "hh:mm AM/PM")
  const formatTime = (time: string) => {
    const formattedTime = new Date(time);
    return formattedTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Set to true for AM/PM
    });
  };



  const handleStatusChange = (bookingId: string, newStatus: string) => {
  dispatch(updateBookingStatus({ status: newStatus, bookingId }));
};


  // Function to handle sending chat




  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead onClick={() => onSort && onSort("id")} className={onSort ? "cursor-pointer" : ""}>Booking ID {getSortSymbol("id")}</TableHead>
            <TableHead onClick={() => onSort && onSort("date")} className={onSort ? "cursor-pointer" : ""}>Date {getSortSymbol("date")}</TableHead>
            <TableHead onClick={() => onSort && onSort("pickupTime")} className={onSort ? "cursor-pointer" : ""}>Pickup Time {getSortSymbol("pickupTime")}</TableHead>
            <TableHead onClick={() => onSort && onSort("kilometers")} className={onSort ? "cursor-pointer" : ""}>KMs {getSortSymbol("kilometers")}</TableHead>
            <TableHead onClick={() => onSort && onSort("pickupLocation")} className={onSort ? "cursor-pointer" : ""}>Pickup {getSortSymbol("pickupLocation")}</TableHead>
            <TableHead onClick={() => onSort && onSort("dropLocation")} className={onSort ? "cursor-pointer" : ""}>Drop {getSortSymbol("dropLocation")}</TableHead>
            {showCustomer && (
              <TableHead onClick={() => onSort && onSort("customerId")} className={onSort ? "cursor-pointer" : ""}>Customer {getSortSymbol("customerId")}</TableHead>
            )}
            {(showDriver || showDriverSelect) && (
              <TableHead onClick={() => onSort && onSort("driver")} className={onSort ? "cursor-pointer" : ""}>Driver {getSortSymbol("driver")}</TableHead>
            )}
            <TableHead>Status</TableHead>
            <TableHead onClick={() => onSort && onSort("amount")} className={onSort ? "cursor-pointer" : ""}>Amount ($) {getSortSymbol("amount")}</TableHead>
            <TableHead>Chat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {Array.isArray(bookinglist) && bookinglist.length > 0 && (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-gray-400 py-8">
                No bookings found
              </TableCell>
            </TableRow>
          )} */}
          {Array.isArray(bookings) && bookinglist?.map((b) => {
            const customer = getCustomerById(b.customerId);
            const driver = getDriverById(b.driverId);

            return (
              <React.Fragment key={b.id}>
                <TableRow className={expandedRows[b.id] ? "border-b-0" : ""}>
                  <TableCell className="p-2 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleRow(b.id)}
                    >
                      {expandedRows[b.id] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{b.id}</TableCell>
                  <TableCell>{formatDate(b.date)}</TableCell> {/* Formatted Date */}
                  <TableCell>{formatTime(b.pickupTime)}</TableCell> {/* Formatted Time */}
                  <TableCell>{b.kilometers}</TableCell>
                  <TableCell>{b.pickupLocation}</TableCell>
                  <TableCell>{b.dropLocation}</TableCell>
                  {showCustomer && (
                    <TableCell>
                      {(() => {
                        const bookingCustomer = availableCustomers.find(c => c.id?.toString() === b.customerId?.toString());
                        return bookingCustomer
                          ? `${bookingCustomer.username} (${b.customerId})`
                          : b.customerId;
                      })()}
                    </TableCell>
                  )}
                  {showDriverSelect ? (
                    <TableCell>
                      <Select
                        value={driver ? driver.id.toString() : ""}
                        onValueChange={val => onUpdateDriver && onUpdateDriver(b.id, val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDrivers.map(d => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  ) : showDriver ? (
                    <TableCell>
                      {driver ? driver.name : "No Driver"}
                    </TableCell>
                  ) : null}

                  <TableCell>
                    <BookingStatusDropdown
                      status={b.status as "pending" | "waiting for confirmation" | "upcoming" | "completed" | "cancelled"}
                      onSetWaiting={
                        onUpdateStatus && b.status === "pending"
                          ? () => onUpdateStatus(b.id, "waiting for confirmation")
                          : undefined
                      }
                      onApprove={
                        onUpdateStatus && b.status === "waiting for confirmation"
                          ? () => onUpdateStatus(b.id, "upcoming")
                          : undefined
                      }
                      onCancel={
                        onUpdateStatus
                          ? () => onUpdateStatus(b.id, "cancelled")
                          : undefined
                      }
                    />

                  </TableCell>
                  <TableCell>${b.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <ChatDialog bookingId={b.id} />
                  </TableCell>
                </TableRow>
                {expandedRows[b.id] && (
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
                            <span className="font-medium">Notes:</span> {b.specialRequest || "No notes available"}
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
