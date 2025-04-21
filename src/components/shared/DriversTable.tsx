
import React from "react";
import { Driver, getCarById } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface DriversTableProps {
  drivers: Driver[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DriversTable({ drivers, selectedId, onSelect }: DriversTableProps) {
  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Car</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((d) => (
            <TableRow
              key={d.id}
              data-selected={selectedId === d.id}
              onClick={() => onSelect(d.id)}
              className={`cursor-pointer ${selectedId === d.id ? "bg-blue-50" : ""}`}
            >
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.email}</TableCell>
              <TableCell>{d.phone}</TableCell>
              <TableCell>{getCarById(d.carId)?.model || d.carId}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${d.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}>
                  {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
