import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export interface Message {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface MessageTableProps {
  messages: Message[];
}

export function MessageTable({ messages }: MessageTableProps) {
  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg.id}>
              <TableCell>{msg.fullname}</TableCell>
              <TableCell>{msg.email}</TableCell>
              <TableCell>{msg.phone}</TableCell>
              <TableCell>{msg.subject}</TableCell>
              <TableCell>{msg.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}