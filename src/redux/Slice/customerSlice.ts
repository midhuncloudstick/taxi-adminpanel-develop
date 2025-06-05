

import { api } from "@/services/EventServices";
import { Booking } from "@/types/booking";
import { Customer } from "@/types/customer";
// import { Cars } from "@/types/fleet";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";





interface CustomerState {
  customers:Customer[];
  selectedCustomers: Customer [];
  loading: boolean;
  error: string | null;
  page:any;
 limit:any;
 total_pages:any;
 customerhistory:Booking[]
 search:string;
 
//   // Define the correct type here
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  selectedCustomers: null,
  page:null,
  limit:null,
  total_pages:null,
  customerhistory:null,
  search :null
};







export const listCustomerUsers = createAsyncThunk(
  "customers/get",
  async ({ page, limit, search }: { page: number; limit: number, search:string}) => {
    try {
      const url = `/api/v1/user/list?page=${page}&limit=${limit}&search=${search}`;
      const response = await api.getEvents(url);
      const customerData = await response.data;
      return customerData;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "car details fetching failed";
      }
      return "An unexpected error occurred.";
    }
  }
);

export const listBookingBycustomerId = createAsyncThunk(
  'booking/listByCustomerId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const url = `/api/v1/user/booking/${userId}`;
      const response = await api.getEvents(url);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Something went wrong');
    }
  }
);



export const customerHistory = createAsyncThunk(
  "booking/sort",
  async (
    {
      search,
      customerID,
      
      page,
      limit,
     
    }: {
      search: string,
      customerID: string,
     
      page: number,
      limit: number,
     
    }
  ) => {
    try {
      const baseUrl = "/api/v1/booking/list";
      const queryParams = new URLSearchParams();
      if (search !== undefined && search !== null && search !== "") queryParams.append('search', String(search));
      if (customerID !== undefined && search !== null && search !== "") queryParams.append('customerID', String(customerID));
     
      if (typeof page === "number") queryParams.append('page', String(page));
      if (typeof limit === "number") queryParams.append('limit', String(limit));
     



      const url = `${baseUrl}?${queryParams.toString()}`;
      const response = await api.getEvents(url);
       return  response.data
      
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "booking details fetching failed";
      }
      return "An unexpected error occurred.";
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
            state.customers = action.payload.message;
             state.page = action.payload.page;
              state.total_pages = action.payload.total_pages
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
     
        .addCase(customerHistory.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(customerHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.customerhistory = action.payload.message;
           
            console.log("action.payload", action.payload);
            state.error = null;
          })
          .addCase(customerHistory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          }) 

        



          
       
   } 
});

export const { addCars, updateCars, setCars } = customerSlice.actions;
export default customerSlice.reducer;
