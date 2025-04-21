
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Booking, Driver, getDriverById, getCustomerById } from "@/data/mockData";
import { PhoneCall } from "lucide-react";
import { Button } from "../ui/button";

interface BookingsTableProps {
  bookings: Booking[];
  drivers: Driver[];
  showCustomer?: boolean;
  showDriverSelect?: boolean;
  onUpdateDriver?: (bookingId: string, driverId: string) => void;
  onSort?: (col: string) => void;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc";
}

export function BookingsTable({
  bookings,
  drivers,
  showCustomer,
  showDriverSelect,
  onUpdateDriver,
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
            <TableHead onClick={() => onSort && onSort("id")} className="cursor-pointer">Booking ID {getSortSymbol("id")}</TableHead>
            <TableHead onClick={() => onSort && onSort("date")} className="cursor-pointer">Date {getSortSymbol("date")}</TableHead>
            <TableHead onClick={() => onSort && onSort("pickupTime")} className="cursor-pointer">Pickup Time {getSortSymbol("pickupTime")}</TableHead>
            <TableHead onClick={() => onSort && onSort("kilometers")} className="cursor-pointer">KMs {getSortSymbol("kilometers")}</TableHead>
            <TableHead onClick={() => onSort && onSort("pickupLocation")} className="cursor-pointer">Pickup {getSortSymbol("pickupLocation")}</TableHead>
            <TableHead onClick={() => onSort && onSort("dropLocation")} className="cursor-pointer">Drop {getSortSymbol("dropLocation")}</TableHead>
            {showCustomer && (
              <TableHead onClick={() => onSort && onSort("customerId")} className="cursor-pointer">Customer</TableHead>
            )}
            {showDriverSelect && (
              <TableHead onClick={() => onSort && onSort("driver")} className="cursor-pointer">Driver</TableHead>
            )}
            <TableHead>Status</TableHead>
            <TableHead onClick={() => onSort && onSort("amount")} className="cursor-pointer">Amount ($) {getSortSymbol("amount")}</TableHead>
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
                ) : null}
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    b.status === "upcoming"
                      ? "bg-taxi-teal/20 text-taxi-teal"
                      : b.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                  }`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
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
