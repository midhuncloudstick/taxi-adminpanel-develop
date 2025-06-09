import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select";
import {
    getCustomerById
} from "@/data/mockData";
import {
    ChevronDown,
    ChevronUp,
    MapPin,
    Calendar,
    Clock
} from "lucide-react";
import { Button } from "../ui/button";
import { BookingStatusDropdown } from "./BookingStatusDropdown";
import { ChatDialog } from "./ChatDialog";
// import { Drivers } from "@/types/driver";
import { Booking } from "@/types/booking";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
    AssignDriverthroughEmail,
    AssignDriverthroughSMS,
    sortingInBooking,

} from "@/redux/Slice/bookingSlice";
import { useAppSelector } from "@/redux/hook";
import {
    listCustomerUsers
} from "@/redux/Slice/customerSlice";
import { getDrivers } from "@/redux/Slice/driverSlice";
import { Customer } from "@/types/customer";
import { clearnotification } from "@/redux/Slice/notificationSlice";
import Search from "@/pages/Search";
import { Pagination } from "../ui/paginationNew";
import { Drivers } from '@/types/driver'

interface BookingsTableProps {
    list: Booking[]

}

export function CustomersHistoryTable({
    list
}: BookingsTableProps) {
    const [internalExpandedRows, setInternalExpandedRows] = useState<Record<string, boolean>>({});

    const [availableDrivers, setAvailableDrivers] = useState<Drivers[]>([]);
    const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false); // ⬅️ added loading state

    // const bookinglist = useAppSelector((state) => state.booking.selectedBooking);
    const toggleidfromNotification = useAppSelector((state) => state.notification.toglelistId)
    const customersFromStore = useAppSelector(state => state.customer.customers || []);
    const driversFromStore = useAppSelector(state => state.driver.drivers || []);
    const current_Page = useAppSelector((state) => state.customer.page || 1);
    const totalPages = useAppSelector((state) => state.customer.total_pages || 1);
    const [localPage, setLocalPage] = useState(current_Page);
    const dispatch = useDispatch<AppDispatch>();
    const limit = 10;

    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true); // ⬅️ start loading
            await Promise.all([
                dispatch(sortingInBooking({
                    search: "",          // or your current search term
                    customerID: "",      // or current customer id filter
                    status: "",          // or current status filter
                    driver: "",          // or current driver filter
                    bookingId: "",       // or current booking id filter
                    date: "",            // or current date filter
                    pickup_time: "",     // or current pickup time filter
                    page: current_Page,
                    limit: limit,
                    // sortBy: sortKey,
                    // sortOrder: sortDirection,
                }))

            ]);
            setLoading(false); // ⬅️ end loading
        };

        fetchData();
    }, [Search]);

    useEffect(() => {
        setAvailableCustomers(customersFromStore);
    }, [customersFromStore]);

    useEffect(() => {
        setAvailableDrivers(driversFromStore);
    }, [driversFromStore]);

    useEffect(() => {
        toggleRow(toggleidfromNotification)
    }, [toggleidfromNotification])



    const toggleRow = (bookingId: string) => {

        setInternalExpandedRows(prev => ({
            ...prev,
            [bookingId]: !prev[bookingId]
        }));
        setInterval(() => {
            dispatch(clearnotification(bookingId))
        }, 2000);

    };
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US");

    const formatTime = (time: string) => {
        const localTimeString = time.replace(/Z$/, ""); // removes Z if it's there
        return new Date(localTimeString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    const assignDriver = async ({
        driverId,
        bookingId,
        driverType,
    }: {
        driverId: number;
        bookingId: string;
        driverType: "internal" | "external";
    }) => {
        try {
            if (driverType === "internal") {
                await dispatch(AssignDriverthroughSMS({ driverId, bookingId }));
            } else {
                await dispatch(AssignDriverthroughEmail({ driverId, bookingId }));
            }
            handlePageChange(1)
        } catch (error) {
            console.log("assigned driver error")
        }



        // await dispatch(getDrivers());
    };


    const handlePageChange = async (newPage: number) => {

    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <span className="text-gray-600 text-lg">Loading bookings...</span>
            </div>
        );
    }

    return (

        <div className="overflow-auto rounded-lg shadow bg-white">
            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10" />
                        <TableHead >Booking ID </TableHead>
                        <TableHead >Date </TableHead>
                        <TableHead >Pickup Time</TableHead>
                        <TableHead>KMs</TableHead>
                        <TableHead  >Pickup</TableHead>
                        <TableHead >Drop</TableHead>
                        <TableHead  >Customer </TableHead>
                        <TableHead >Driver </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead >Amount ($) </TableHead>
                        <TableHead>Chat</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(list) && list.map((b) => {
                        const customer = getCustomerById(b.customerId);

                        return (
                            <React.Fragment key={b.id}>
                                <TableRow >
                                    <TableCell className="p-2 text-center">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleRow(b.id)}>

                                        </Button>
                                    </TableCell>
                                    <TableCell className="font-medium">{b.id}</TableCell>
                                    <TableCell>{formatDate(b.date)}</TableCell>
                                    <TableCell>{formatTime(b.pickupTime)}</TableCell>
                                    <TableCell>{b.kilometers}</TableCell>
                                    <TableCell>{b.pickupLocation}</TableCell>
                                    <TableCell>{b.dropLocation}</TableCell>
                                    <TableCell>{b.user_firstname + b.user_lastname}</TableCell>

                                    <TableCell>
                                        {b.driver_name? b.driver_name: "Driver not assigned"}
                                    </TableCell>

                                    <TableCell>
                                        {b.status}
                                    </TableCell>
                                    <TableCell>${b.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <ChatDialog bookingId={b.id} />
                                    </TableCell>
                                </TableRow>
                                {/* {expandedRows?.[b.id] && (
                  <TableRow>
                    <TableCell colSpan={12} className="bg-gray-50 p-0">
                      <div className="p-4 space-y-4">
                        <h4 className="font-medium text-lg">Booking Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-taxi-blue" />
                              <span className="font-medium">Date:</span> {formatDate(b.date)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-taxi-blue" />
                              <span className="font-medium">Time:</span> {formatTime(b.pickupTime)}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-taxi-blue" />
                              <span className="font-medium">Pickup:</span> {b.pickupLocation}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-taxi-blue" />
                              <span className="font-medium">Destination:</span> {b.dropLocation}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {customer && (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Customer:</span> {customer.name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Phone:</span> {customer.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Email:</span> {customer.email}
                                </div>
                              </>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Distance:</span> {b.kilometers} km
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Fare:</span> ${b.amount.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        {b.specialRequest && (
                          <div className="mt-2">
                            <span className="font-medium">Notes:</span> {b.specialRequest}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )} */}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
            {/* <div className="py-4">
                <Pagination
                    currentPage={current_Page}
                    itemsPerPage={limit}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div> */}
        </div>
    );
}
