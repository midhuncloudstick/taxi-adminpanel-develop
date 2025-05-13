
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Booking, Driver, getDriverById, getCustomerById } from "@/data/mockData";
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { BookingStatusDropdown } from "./BookingStatusDropdown";
import { ChatDialog } from "./ChatDialog";
import { Drivers } from "@/types/driver";

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
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-gray-400 py-8">
                No bookings found
              </TableCell>
            </TableRow>
          )}
          {bookings.map((b) => {
            const customer = getCustomerById(b.customerId);
            const driver = getDriverById(b.driver);
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
                  <TableCell>{b.date}</TableCell>
                  <TableCell>{b.pickupTime}</TableCell>
                  <TableCell>{b.kilometers}</TableCell>
                  <TableCell>{b.pickupLocation}</TableCell>
                  <TableCell>{b.dropLocation}</TableCell>
                  {showCustomer && (
                    <TableCell>
                      {customer ? `${customer.name} (${b.customerId})` : b.customerId}
                    </TableCell>
                  )}
                  {showDriverSelect ? (
                    <TableCell>
                      <Select
                        value={b.driver}
                        onValueChange={val => onUpdateDriver && onUpdateDriver(b.id, val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map(d => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                              {d.name}
                            </SelectItem>

                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  ) : showDriver ? (
                    <TableCell>
                      {driver ? driver.name : b.driver}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <BookingStatusDropdown
                      status={b.status}
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
                              <span className="font-medium">Date:</span> {b.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-taxi-blue" />
                              <span className="font-medium">Time:</span> {b.pickupTime}
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
                        {b.notes && (
                          <div className="mt-2">
                            <span className="font-medium">Notes:</span> {b.notes || "No notes available"}
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
