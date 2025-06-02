// import React, { useState, useCallback } from "react";
// import { BookingsTable } from "../shared/BookingsTable";
// import { UpcomingTripsDropdown } from "../layout/UpcomingTripsDropdown";
// import { useAppSelector } from "@/redux/hook";


// const BookingDashboard = () => {
//     const bookinglist = useAppSelector((state) => state.booking.selectedBooking);
//     const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

//     const handleExpandRow = useCallback((id: string) => {
//         setExpandedRows((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     }, []);

//     return (
//         <div className="relative">
//             {/* Upcoming Trips Dropdown */}
//             <UpcomingTripsDropdown open={true} onTripClick={handleExpandRow} />

//             {/* Booking Table */}
//             <BookingsTable
//                 bookings={bookinglist} // or whatever your data source is
//                 expandedRows={expandedRows}
//                 onExpandRow={handleExpandRow}
//             />
//         </div>
//     );
// };

// export default BookingDashboard;
