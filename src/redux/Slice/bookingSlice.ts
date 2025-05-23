

import { api } from "@/services/EventServices";
import { Booking, chats } from "@/types/booking";
import { Drivers } from "@/types/driver";
import { Cars } from "@/types/fleet";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";





interface BookingState {
  booking: Booking[];
  chats:chats[]
  selectedBooking: Booking[] | null;
  loading: boolean;
  error: string | null;


  //   // Define the correct type here
}

const initialState: BookingState = {
  booking: [],
  chats:[],
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
    async(
        {message,bookingId}:{message:string ,bookingId:string}
    )=>{
        try{
          const url =`/api/v1/booking/${bookingId}/chats`;
          const response = await api.postEvents(url,{message,bookingId});
          const chat = response.data;
          return chat;
        }catch (error:unknown){
            if (axios.isAxiosError(error)){
                return error || "chat detail fetching failed";
            }
            return "An unexpected error occured"
        }
    }
)


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
}
});

export const { addBooking, updateBooking, setBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
