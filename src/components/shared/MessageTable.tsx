import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Message } from "@/types/message";
import { Pagination } from "../ui/paginationNew";
import { useAppSelector } from "@/redux/hook";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

interface MessageTableProps {
  messages: Message[];
}

export function MessageTable({ messages }: MessageTableProps) {

  const current_Page = useAppSelector((state) => state.message.page || 1);
  const totalPages = useAppSelector((state) => state.message.total_pages || 1);
  const [localPage, setLocalPage] = useState(current_Page);
  const dispatch = useDispatch<AppDispatch>();
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const handlePageChange = (newPage: number) => {
    setLocalPage(newPage);
  };
  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(messages) &&
            messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell>{msg.full_name}</TableCell>
              <TableCell>{new Date(msg.created_at).toLocaleDateString()}</TableCell>


                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.phone}</TableCell>
                <TableCell>{msg.subject}</TableCell>
                <TableCell>{msg.message}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
 <div className="py-4">
        <Pagination
          currentPage={current_Page}
          itemsPerPage={limit}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
