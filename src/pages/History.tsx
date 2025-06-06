import { PageContainer } from "@/components/layout/PageContainer";
import { BookingsTable } from "@/components/shared/BookingsTable";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { histories } from "@/redux/Slice/historySlice";
import { useAppSelector } from "@/redux/hook";

export default function History() {
  const listhistorties = useAppSelector((state) => state.history.history);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(histories());
  }, [dispatch]);

  return (
    <PageContainer title="Booking History">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Booking History</h2>
          <p className="text-sm text-gray-500">View all historical bookings and trip data.</p>
        </div>
        <BookingsTable 
          bookings={listhistorties} 
          showCustomer 
          showDriver 
        />
      </div>
    </PageContainer>
  );
}
