
import React, { useEffect } from "react";
// import { Customer } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { listCustomerUsers } from "@/redux/Slice/customerSlice";
import {Customer } from '@/types/customer'

interface CustomersTableProps {
  customers: Customer[];
  selectedId: any | null;
  onSelect: (id: number) => void;
}

export function CustomersTable({ customers, selectedId, onSelect }: CustomersTableProps) {


  const dispatch = useDispatch<AppDispatch>()

useEffect(()=>{
  dispatch(listCustomerUsers())
},[dispatch])

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
              <TableCell>{c.username}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
