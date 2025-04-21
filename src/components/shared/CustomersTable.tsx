
import React from "react";
import { Customer } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface CustomersTableProps {
  customers: Customer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CustomersTable({ customers, selectedId, onSelect }: CustomersTableProps) {
  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow
              key={c.id}
              data-selected={selectedId === c.id}
              onClick={() => onSelect(c.id)}
              className={`cursor-pointer ${selectedId === c.id ? "bg-blue-50" : ""}`}
            >
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
