import React, { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { MessageTable } from "@/components/shared/MessageTable";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMessage } from "@/redux/Slice/messageSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

export default function MessagePage() {
  const messageList = useAppSelector((state) => state.message.messages);
  const currentPage = useAppSelector((state) => state.driver.page || 1);
  const totalPages = useAppSelector((state) => state.driver.total_pages || 1);
  const [localPage, setLocalPage] = useState(currentPage);
  const dispatch = useDispatch<AppDispatch>();
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    dispatch(getMessage({page:currentPage,limit}));
  }, [dispatch]);

  return (
    <PageContainer title="Messages">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-taxi-blue">Messages</h2>
        <p className="text-sm text-gray-500">View all customer messages.</p>
        <MessageTable messages={messageList} />
      </div>
    </PageContainer>
  );
}
