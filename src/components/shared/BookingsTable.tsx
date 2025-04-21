
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Booking, Driver, getDriverById, getCustomerById } from "@/data/mockData";
import { PhoneCall } from "lucide-react";
import { Button } from "../ui/button";
import { BookingStatusDropdown } from "./BookingStatusDropdown";

interface BookingsTableProps {
  bookings: Booking[];
  drivers?: Driver[];
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

  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-gray-400 py-8">
                No bookings found
              </TableCell>
            </TableRow>
          )}
          {bookings.map((b) => {
            const customer = getCustomerById(b.customerId);
            const driver = getDriverById(b.driver);
            return (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
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
                          <SelectItem key={d.id} value={d.id}>
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
                    onApprove={
                      onUpdateStatus
                        ? () => onUpdateStatus(b.id, "upcoming")
                        : undefined
                    }
                    onCancel={
                      onUpdateStatus
                        ? () =>
                            onUpdateStatus(
                              b.id,
                              b.status === "pending" ? "cancelled" : "cancelled"
                            )
                        : undefined
                    }
                  />
                </TableCell>
                <TableCell>${b.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {customer && customer.phone ? (
                    <Button
                      variant="ghost"
                      className="p-2 hover:bg-taxi-teal/20"
                      onClick={() => window.open(`tel:${customer.phone.replace(/\s+/g, "")}`)}
                      title={`Call ${customer.name}`}
                    >
                      <PhoneCall size={18} className="text-taxi-blue" />
                    </Button>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
