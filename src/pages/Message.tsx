import React, { useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { MessageTable } from "@/components/shared/MessageTable";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMessage } from "@/redux/Slice/messageSlice";

export default function MessagePage() {
  const dispatch = useAppDispatch();
  const messageList = useAppSelector((state) => state.message.messages);

  useEffect(() => {
    dispatch(getMessage());
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
