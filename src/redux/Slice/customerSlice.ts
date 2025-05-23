

import { api } from "@/services/EventServices";
import { Customer } from "@/types/customer";
// import { Cars } from "@/types/fleet";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";





interface CustomerState {
  customers:Customer[];
  selectedCustomers: Customer [];
  loading: boolean;
  error: string | null;
 
 
//   // Define the correct type here
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  selectedCustomers: null,
};








export const listCustomerUsers = createAsyncThunk(
  "customers/get",
  async (
  _,
  ) => {
    
    try {
    //   const userId = localStorage.getItem("userid");
    const url = "/api/v1/user/list";

      const response = await api.getEvents(url);
      const customerData = await response.data;
      return customerData;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error|| "car details fetching failed";
      }
      return "An unexpected error occurred.";
    }
  }
);

export const listBookingBycustomerId = createAsyncThunk(
  'booking/listByCustomerId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.getEvents(`/api/v1/bookings/customer/${userId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Something went wrong');
    }
  }
);













const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    addCars: (state, action: PayloadAction<Customer>) => {
    //   state.tasks.push({
    //     ...action.payload,
    //     startDate: new Date(action.payload.startDate).toISOString(),
    //     endDate: new Date(action.payload.endDate).toISOString(),
    //     status: action.payload.status, // Ensure this matches "NotStarted" | "InProgress" | "Completed"
    //     taskCost: action.payload.taskCost || "0",
    //   });
    },
    updateCars: (state, action: PayloadAction<Customer>) => {
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
    deleteCars: (state, action: PayloadAction<number>) => {
    //   state.tasks = state.tasks.filter((task) => task.ID !== action.payload);
    },
    setCars: (state, action: PayloadAction<Customer[]>) => {
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
        .addCase(listCustomerUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(listCustomerUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedCustomers = action.payload.message;
           
            console.log("action.payload", action.payload);
            state.error = null;
          })
          .addCase(listCustomerUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          }) 

          
        .addCase(listBookingBycustomerId.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(listBookingBycustomerId.fulfilled, (state, action) => {
            state.loading = false;
            state.customers = action.payload.message;
           
            console.log("action.payload", action.payload);
            state.error = null;
          })
          .addCase(listBookingBycustomerId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          }) 
     


        



          
       
   } 
});

export const { addCars, updateCars, setCars } = customerSlice.actions;
export default customerSlice.reducer;
