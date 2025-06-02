import React, { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {Message } from '@/types/message'
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { AppDispatch } from "@/redux/store";
import { getMessage } from "@/redux/Slice/messageSlice";

// export interface Message {
//   id: string;
//   fullname: string;
//   email: string;
//   phone: string;
//   subject: string;
//   message: string;
// }

interface MessageTableProps {
  messages: Message[];
}

export function MessageTable({ messages }: MessageTableProps) {

  const dispatch = useAppDispatch()
 const messageList = useAppSelector((state)=>state.message.messages)
  useEffect(()=>{
    dispatch(getMessage())
  },[])
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
          {Array.isArray(messageList) && messageList.map((msg) => (
            <TableRow key={msg.id}>
              <TableCell>{msg.username}</TableCell>
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