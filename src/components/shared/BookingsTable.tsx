import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getCustomerById } from "@/data/mockData";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Clock,
  Building,
  Truck,
  Car,
  Loader2,
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
import { listCustomerUsers } from "@/redux/Slice/customerSlice";
import { getAvailableDrivers, getDrivers } from "@/redux/Slice/driverSlice";
import { Customer } from "@/types/customer";
import { clearnotification } from "@/redux/Slice/notificationSlice";
import Search from "@/pages/Search";
import { Pagination } from "../ui/paginationNew";
import { Drivers } from "@/types/driver";
import { Skeleton } from "../ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
interface BookingsTableProps {
  showCustomer?: boolean;
  showDriver?: boolean;
  showDriverSelect?: boolean;
  onUpdateDriver?: (bookingId: string, driverId: string) => void;
  onUpdateStatus?: (bookingId: string, newStatus: Booking["status"]) => void;
  onSort?: (col: string) => void;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc";
  expandedRows?: Record<string, boolean>;
  onExpandRow?: (id: string) => void;

  status?: string;
  driver?: string;
  location?: string;
  customerId?: string;
  setStatus?: (val: string) => void;
  page?: number;
  setpage?: (val: number) => void;
  setDriver?: (val: string) => void;
  setLocation?: (val: string) => void;
  setCustomerId?: (val: string) => void;
  getlist?: () => void;
  onBookingSelect?: (bookingId: string) => void;
  getDrivers?: () => void; // ✅ callback
}

export function BookingsTable({
  showCustomer,
  showDriver,
  showDriverSelect,

  onSort,
  sortKey,
  sortDirection,
  expandedRows: externalExpandedRows,
  onExpandRow,
  status,
  driver,
  location,
  customerId,
  setStatus,
  setDriver,
  setLocation,
  setCustomerId,
  page,
  setpage,
  getlist,
}: BookingsTableProps) {
  const [internalExpandedRows, setInternalExpandedRows] = useState<
    Record<string, boolean>
  >({});
  const expandedRows = externalExpandedRows ?? internalExpandedRows;

  const [availableDrivers, setAvailableDrivers] = useState<Drivers[]>([]);
  // const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false); // ⬅️ added loading state
  const [loadingdiver, setLoadinngdriver] = useState(false);
  const [loadingDriverBookingId, setLoadingDriverBookingId] = useState<
    string | null
  >(null);
  const bookinglist = useAppSelector((state) => state.booking.selectedBooking);
  const toggleidfromNotification = useAppSelector(
    (state) => state.notification.toglelistId
  );

  const driversFromStore = useAppSelector(
    (state) => state.driver.drivers || []
  );
  const current_Page = useAppSelector((state) => state.booking.page || 1);
  const totalPages = useAppSelector((state) => state.booking.total_pages || 1);
  const [localPage, setLocalPage] = useState(current_Page);
  const dispatch = useDispatch<AppDispatch>();
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const availabledriverslist =
    useAppSelector((state) => state.driver.AvailableDrivers) ?? [];

  useEffect(() => {
    setAvailableDrivers(driversFromStore);
  }, [driversFromStore]);

  useEffect(() => {
    const fetchtoggledata = async () => {
      if (toggleidfromNotification) {
        const findeindex = bookinglist.findIndex(
          (item) => item.id == toggleidfromNotification
        );
        console.log("the index find", findeindex);

        if (findeindex < 0) {
          const firstid = bookinglist[0].id;
          const differnce =
            Number(firstid.split("-")[1]) -
            Number(toggleidfromNotification.split("-")[1]);
          const itemsPerPage = 10;
          const targetPage = Math.floor(differnce / itemsPerPage) + 1;
          console.log(targetPage, "target page");
          console.log(targetPage <= 0 ? 1 : targetPage);
          setDriver("all");
          setCustomerId("");
          setStatus("all");
          setLocation("");

          setpage(targetPage <= 0 ? 1 : targetPage);
          handlePageChange(targetPage <= 0 ? 1 : targetPage);
        }

        toggleRow(toggleidfromNotification);
      }
    };
    fetchtoggledata();
  }, [toggleidfromNotification]);

  useEffect(() => {
    setpage(current_Page);
  }, [current_Page]);

  const toggleRow = (bookingId: string) => {
    dispatch(clearnotification(bookingId));
    setInternalExpandedRows((prev) => ({
      [bookingId]: !prev[bookingId],
    }));
  };
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US");

  const formatTime = (time: string) => {
    const localTimeString = time.replace(/Z$/, ""); // removes Z if it's there
    return new Date(localTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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
      setLoadinngdriver(true);
      setLoadingDriverBookingId(bookingId);
        await dispatch(AssignDriverthroughSMS({ driverId, bookingId }));
      getlist();
    await  dispatch(getAvailableDrivers());
    } catch (error) {
      console.log("assigned driver error");
    } finally {
      setLoadinngdriver(false);
      setLoadingDriverBookingId(null);
    }
  };

  const getSortSymbol = (col: string) =>
    sortKey === col ? (sortDirection === "asc" ? "▲" : "▼") : "";

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);

      await dispatch(
        sortingInBooking({
          search: location,
          customerID: customerId,
          status: status,
          driver: driver,
          bookingId: "",
          date: "",
          pickup_time: "",
          page: newPage, // Use newPage instead of current_Page
          limit: limit,
          sortBy: sortKey, // Include current sort key
          sortOrder: sortDirection, // Include current sort order
        })
      );
      setLocalPage(newPage); // Update local page state
    } catch (error) {
      console.error("Error changing page:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead
              onClick={() => onSort?.("id")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Booking ID {getSortSymbol("id")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("date")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Date {getSortSymbol("date")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("pickupTime")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Pickup Time {getSortSymbol("pickupTime")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("kilometers")}
              className={onSort ? "cursor-pointer" : ""}
            >
              KMs {getSortSymbol("kilometers")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("pickupLocation")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Pickup {getSortSymbol("pickupLocation")}
            </TableHead>
            <TableHead
              onClick={() => onSort?.("dropLocation")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Drop {getSortSymbol("dropLocation")}
            </TableHead>
            {showCustomer && (
              <TableHead
                onClick={() => onSort?.("customerId")}
                className={onSort ? "cursor-pointer" : ""}
              >
                Customer {getSortSymbol("customerId")}
              </TableHead>
            )}
            {(showDriver || showDriverSelect) && (
              <TableHead
                onClick={() => onSort?.("driver")}
                className={onSort ? "cursor-pointer" : ""}
              >
                Driver {getSortSymbol("driver")}
              </TableHead>
            )}
            <TableHead>Status</TableHead>
            <TableHead
              onClick={() => onSort?.("amount")}
              className={onSort ? "cursor-pointer" : ""}
            >
              Amount ($) {getSortSymbol("amount")}
            </TableHead>
            <TableHead>Chat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // Skeleton loading rows
            [...Array(11)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-6 w-6 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {showCustomer && (
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                )}
                {(showDriver || showDriverSelect) && (
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                )}
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-10" />
                </TableCell>
              </TableRow>
            ))
          ) : Array.isArray(bookinglist) && bookinglist.length > 0 ? (
            bookinglist.map((b) => {
              const customer = getCustomerById(b.customerId);

              return (
                <React.Fragment key={b.id}>
                  <TableRow
                    id={`booking-row-${b.id}`}
                    className={expandedRows?.[b.id] ? "border-b-0" : ""}
                  >
                    <TableCell className="p-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleRow(b.id)}
                      >
                        {expandedRows?.[b.id] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{b.id}</TableCell>
                    <TableCell>{formatDate(b.date)}</TableCell>
                    <TableCell>{formatTime(b.pickupTime)}</TableCell>
                    <TableCell>{b.kilometers}</TableCell>
                    <TableCell>{b.pickupLocation}</TableCell>
                    <TableCell>{b.dropLocation}</TableCell>
                    {showCustomer && (
                      <TableCell>
                        {b.user_firstname + " " + b.user_lastname}
                      </TableCell>
                    )}
                    {showDriverSelect && (
                      <TableCell>
                        <Select
                          value={b.driverId?.toString() || ""}
                          onValueChange={async (val) => {
                            const selectedDriver = driversFromStore.find(
                              (d) => d.id?.toString() === val
                            );
                            if (selectedDriver) {
                              try {
                                await assignDriver({
                                  driverId: selectedDriver.id,
                                  bookingId: b.id,
                                  driverType: selectedDriver.type,
                                });
                              } catch (error) {
                                // Reopen dropdown on error
                                document
                                  .getElementById(`driver-select-${b.id}`)
                                  ?.click();
                              }
                            }
                          }}
                          disabled={loadingDriverBookingId !== null} // Disable all selects when any is loading
                        >
                          <SelectTrigger id={`driver-select-${b.id}`}>
                            <div className="flex items-center  ">
                              {loadingDriverBookingId === b.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-xs">Assigning...</span>
                                </>
                              ) : (
                                <SelectValue placeholder="Driver">
                                  {driversFromStore.find(
                                    (d) =>
                                      d.id?.toString() ===
                                      b.driverId?.toString()
                                  )?.name || "Select driver"}
                                </SelectValue>
                              )}
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {/* Search input and driver list */}
                            <div className="px-3 pt-2 pb-1 sticky top-0 bg-white z-10">
                              <Input
                                placeholder="Search drivers..."
                                className="w-full"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                              />
                            </div>
                            {availableDrivers
                              .filter((d) => d.status === "active")
                              .filter(
                                (d) =>
                                  searchTerm === "" ||
                                  d.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                              )
                              .sort((a, b) => (a.type === "internal" ? -1 : 1))
                              .map((d) => {
                                const isAvailable = availabledriverslist.some(
                                  (ad) => ad.id === d.id
                                );
                                return (
                                      <SelectItem key={d.id} value={d.id.toString()}>
        <div className="flex items-center justify-between w-full px-3 py-2">
          <div className="flex items-center gap-2">
            {d.type === "internal" ? (
              <Car className="h-4 w-4 text-blue-500" />
            ) : (
              <Car className="h-4 w-4 text-orange-500" />
            )}
            <span className="font-medium ml-2">{d.name}</span>
             {isAvailable && (
              
            <span className="text-[10px] bg-green-100 text-green-800 px-2  rounded-full ml-2">
              Available
            </span>
          )}
          </div>
         
        </div>
      </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )}
                    <TableCell>
                      <BookingStatusDropdown
                        bookingId={b.id}
                        status={
                          b.status as
                            | "requested"
                            | "pickup"
                            | "waiting for driver confirmation"
                            | "journey started"
                            | "journey completed"
                            | "cancelled"
                        }
                        getlist={getlist}
                      />
                    </TableCell>
                    <TableCell>${b.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <ChatDialog bookingId={b.id} customer ={b.user_firstname+' '+b.user_lastname} />
                    </TableCell>
                  </TableRow>
                  {expandedRows?.[b.id] && (
                    <TableRow>
                      <TableCell colSpan={12} className="bg-gray-50 p-0">
                        <div className="p-4 space-y-4 ">
                          <h4 className="font-medium text-lg">
                            Booking Details
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2 ">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={16}
                                  className="text-taxi-blue"
                                />
                                <span className="font-medium">Date:</span>{" "}
                                {formatDate(b.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-taxi-blue" />
                                <span className="font-medium">Time:</span>{" "}
                                {formatTime(b.pickupTime)}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-taxi-blue" />
                                <span className="font-medium">Trip:</span>{" "}
                                {b.pickupLocation}- {b.dropLocation}
                              </div>
                              {/* <div className="flex items-center gap-2">
                                  <MapPin size={16} className="text-taxi-blue" />
                                  <span className="font-medium">
                                    Destination:
                                  </span>{" "}
                                 
                                </div> */}
                            </div>
                            <div className="space-y-2 ">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Distance:</span>{" "}
                                {b.kilometers} km
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Fare:</span> $
                                {b.amount.toFixed(2)}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Fleet:</span>
                                {b.car_type} - {b.car.model}
                              </div>
                            </div>
                            <div className="space-y-2 ">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Passengers:</span>{" "}
                                {b.passengers}
                              </div>
                              {b.babyCapsule + b.babySeat + b.boosterseat ==
                                0 && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Children:</span>{" "}
                                  0
                                </div>
                              )}

                              {b.boosterseat > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    Boosterseat:
                                  </span>{" "}
                                  {b.boosterseat}
                                </div>
                              )}

                              {b.babyCapsule > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    BabyCapsule:
                                  </span>
                                  {b.babyCapsule}
                                </div>
                              )}

                              {b.babySeat > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">BabySeat:</span>
                                  {b.babySeat}
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Customer:</span>{" "}
                                {b.user_firstname} {b.user_lastname}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Phone:</span>{" "}
                                {b.user_phonenumber}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Email:</span>{" "}
                                {b.user_email}
                              </div>
                            </div>
                          </div>
                          {b.specialRequest && (
                            <div className="mt-2">
                              <span className="font-medium">Notes:</span>{" "}
                              {b.specialRequest}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-gray-500 text-lg">No items found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
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
