import React, { useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { MessageTable, Message } from "@/components/shared/MessageTable";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hook";

export default function MessagePage() {
  const dispatch = useDispatch<AppDispatch>();

  const messages: Message[] = [
    {
      id: "1",
      fullname: "John Doe",
      email: "john@example.com",
      phone: "+61123456789",
      subject: "Booking Inquiry",
      message: "I want to know about my booking status.",
    },
    {
      id: "2",
      fullname: "Jane Smith",
      email: "jane@example.com",
      phone: "+61123456780",
      subject: "Feedback",
      message: "Great service!",
    },
  ];



  return (
    <PageContainer title="Messages">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-taxi-blue">Messages</h2>
        <p className="text-sm text-gray-500">View all customer messages.</p>
        <MessageTable messages={messages} />
      </div>
    </PageContainer>
  );
}