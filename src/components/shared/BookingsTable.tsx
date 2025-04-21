
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Booking, getDriverById } from "@/data/mockData";

interface BookingsTableProps {
  bookings: Booking[];
  showCustomer?: boolean;
  showDriver?: boolean;
}

export function BookingsTable({ bookings, showCustomer, showDriver }: BookingsTableProps) {
  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Pickup Time</TableHead>
            <TableHead>KMs</TableHead>
            <TableHead>Pickup</TableHead>
            <TableHead>Drop</TableHead>
            {showCustomer && <TableHead>Customer ID</TableHead>}
            {showDriver && <TableHead>Driver</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Amount ($)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.id}</TableCell>
              <TableCell>{b.date}</TableCell>
              <TableCell>{b.pickupTime}</TableCell>
              <TableCell>{b.kilometers}</TableCell>
              <TableCell>{b.pickupLocation}</TableCell>
              <TableCell>{b.dropLocation}</TableCell>
              {showCustomer && <TableCell>{b.customerId}</TableCell>}
              {showDriver && (
                <TableCell>
                  {getDriverById(b.driver)?.name || b.driver}
                </TableCell>
              )}
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${b.status === "upcoming"
                    ? "bg-taxi-teal/20 text-taxi-teal"
                    : b.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>${b.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
