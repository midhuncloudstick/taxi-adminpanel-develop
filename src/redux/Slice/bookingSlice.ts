

import { api } from "@/services/EventServices";
import { Booking, chats } from "@/types/booking";
import { Drivers } from "@/types/driver";
import { Cars } from "@/types/fleet";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";





interface BookingState {
  booking: Booking[];
  chats: chats[]
  selectedBooking: Booking[] | null;
  loading: boolean;
  error: string | null;


  //   // Define the correct type here
}

const initialState: BookingState = {
  booking: [],
  chats: [],
  loading: false,
  error: null,
  selectedBooking: null,
};



export const getBookinglist = createAsyncThunk(
  "booking/get",
  async (
    _,
  ) => {

    try {
      const url = "/api/v1/booking/list";

      const response = await api.getEvents(url);
      const bookingData = response.data;
      return bookingData;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "booking details fetching failed";
      }
      return "An unexpected error occurred.";
    }
  }
);

export const bookingInChat = createAsyncThunk(
  "booking/chat",
  async (
    { message, bookingId }: { message: string, bookingId: string }
  ) => {
    try {
      const url = `/api/v1/booking/${bookingId}/chats`;
      const response = await api.postEvents(url, { message, bookingId });
      const chat = response.data;
      return chat;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "chat detail fetching failed";
      }
      return "An unexpected error occured"
    }
  }
)

export const updateBookingStatus = createAsyncThunk(
  "booking/status",
  async (
    { status, bookingId }: { status: string, bookingId: string }
  ) => {
    try {
      const url = `/api/v1/booking/${bookingId}/status`;
      const response = await api.patchEvent(url, { status, bookingId });
      const statusUpdate = response.data;
      return statusUpdate;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "chat detail fetching failed";
      }
      return "An unexpected error occured"
    }
  }
)

export const AssignDriverthroughEmail = createAsyncThunk(
  "booking/email",
  async (
    { driverId, bookingId }: { driverId: number, bookingId: string }
  ) => {
    try {
      const url = `/api/v1/booking/${bookingId}/driver`;
      const response = await api.patchEvent(url, { driverId, bookingId });
      const AssignDriverthroughEmailUpdate = response.data;
      return AssignDriverthroughEmailUpdate;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "chat detail fetching failed";
      }
      return "An unexpected error occured"
    }
  }
)

export const AssignDriverthroughSMS = createAsyncThunk(
  "booking/sms",
  async (
    { driverId, bookingId }: { driverId: number, bookingId: string }
  ) => {
    try {
      const url = `/api/v1/booking/${bookingId}/driver`;
      const response = await api.patchEvent(url, { driverId, bookingId });
      const AssignDriverthroughSMSUpdate = response.data;
      return AssignDriverthroughSMSUpdate;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "chat detail fetching failed";
      }
      return "An unexpected error occured"
    }
  }
)

export const sortingInBooking = createAsyncThunk(
  "booking/sort",
  async (
    {
      search,
      customerID,
      status,
      driver,
      bookingId,
      date,
      pickup_time,
      page,
      limit,
      sortBy,      // e.g. "customerID", "status", "date", "pickup_time", "bookingId"
      sortOrder,   // "asc" or "desc"
    }: {
      search: string,
      customerID: string,
      status: string,
      driver: string,
      bookingId: string,
      date: string,
      pickup_time: string,
      page: number,
      limit: number,
      sortBy?: string,
      sortOrder?: "asc" | "desc"
    }
  ) => {
    try {
      const baseUrl = "/api/v1/booking/list";
      const queryParams = new URLSearchParams();
      if (search !== undefined && search !== null && search !== "") queryParams.append('search', String(search));
      if (customerID !== undefined && search !== null && search !== "") queryParams.append('customerID', String(customerID));
      if (status !== undefined && status !== null && status !== "" && status!=="all") queryParams.append('status', String(status));
      if (driver !== undefined && driver !== null && driver !== "" && driver !=="all") queryParams.append('driver', String(driver));
      if (bookingId !== undefined && bookingId !== null && bookingId !== "") queryParams.append('bookingId', String(bookingId));
      if (date !== undefined && date !== null && date !== "") queryParams.append('date', String(date));
      if (pickup_time !== undefined && pickup_time !== null && pickup_time !== "") queryParams.append('bookingId', String(pickup_time));
      // if (typeof page === "number") queryParams.append('page', String(page));
      // if (typeof limit === "number") queryParams.append('limit', String(limit));
      if (sortBy !== undefined && sortBy !== null && sortBy !== "") queryParams.append('bookingId', String(sortBy));
      if (sortOrder) queryParams.append('sortOrder', sortOrder);



      const url = `${baseUrl}?${queryParams.toString()}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "booking details fetching failed";
      }
      return "An unexpected error occurred.";
    }
  }
);

export const getnotification = createAsyncThunk(
  "booking/notification",
  async (
    _,
  ) => {

    try {
      const url = "/api/v1/booking/upcomings";

      const response = await api.getEvents(url);
      const notificationss = response.data;
      return notificationss;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "booking details fetching failed";
      }
      return "An unexpected error occurred.";
    }
  }
);


const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<Booking>) => {
      //   state.tasks.push({
      //     ...action.payload,
      //     startDate: new Date(action.payload.startDate).toISOString(),
      //     endDate: new Date(action.payload.endDate).toISOString(),
      //     status: action.payload.status, // Ensure this matches "NotStarted" | "InProgress" | "Completed"
      //     taskCost: action.payload.taskCost || "0",
      //   });
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      //   const index = state.tasks.findIndex((task) => task.ID === action.payload.ID);
      //   if (index !== -1) {
      //     state.tasks[index] = {
      //       ...action.payload,
      //       startDate: new Date(action.payload.startDate).toISOString(),
      //       endDate: new Date(action.payload.endDate).toISOString(),
      //       status: action.payload.status, // Ensure this matches "NotStarted" | "InProgress" | "Completed"
      //       taskCost: action.payload.taskCost || "0",
      //     };
      //   }
    },
    deleteBooking: (state, action: PayloadAction<number>) => {
      //   state.tasks = state.tasks.filter((task) => task.ID !== action.payload);
    },
    setBooking: (state, action: PayloadAction<Booking[]>) => {
      //   state.tasks = action.payload.map((task) => ({
      //     ...task,
      //     startDate: task.startDate ? new Date(task.startDate).toISOString() : null, // Validate start_date
      //     endDate: task.endDate ? new Date(task.endDate).toISOString() : null,       // Validate end_date
      //     status: task.status === "NotStarted"
      //       ? "NotStarted"
      //       : task.status === "InProgress"
      //       ? "InProgress"
      //       : task.status === "Completed"
      //       ? "Completed"
      //       : task.status, // Map status values
      //     taskCost: task.taskCost || "0",
      //   }));
    },
  },


  extraReducers: (builder) => {
    builder


      .addCase(getBookinglist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookinglist.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload.message;

        console.log("action.payload.booking", action.payload);
        state.error = null;
      })
      .addCase(getBookinglist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(bookingInChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookingInChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.data;

        console.log("action.payload.booking", action.payload);
        state.error = null;
      })
      .addCase(bookingInChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload.data;

        console.log("action.payload.booking", action.payload);
        state.error = null;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(AssignDriverthroughEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AssignDriverthroughEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload.message;

        console.log("action.payload.booking", action.payload);
        state.error = null;
      })
      .addCase(AssignDriverthroughEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(AssignDriverthroughSMS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AssignDriverthroughSMS.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload.message;

        console.log("action.payload.booking", action.payload);
        state.error = null;
      })
      .addCase(AssignDriverthroughSMS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getnotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getnotification.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload.data;

        console.log("action.payload.booking", action.payload);
        state.error = null;
      })
      .addCase(getnotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(sortingInBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sortingInBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload.message;

        console.log("sortingggggg", action.payload);
        state.error = null;
      })
      .addCase(sortingInBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
});

export const { addBooking, updateBooking, setBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
