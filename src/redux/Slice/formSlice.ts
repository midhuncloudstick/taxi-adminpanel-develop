import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '@/services/EventServices'; // make sure this is correctly exported
import { Car,User,VenderDriver,Booking,Driver} from '@/types/form'

// Interfaces


interface FormState {
  loading: boolean;
  error: string | null;
  updatedData: any;
  
 
}

// Initial state
const initialState: FormState = {
  loading: false,
  error: null,
  updatedData: null,
 
};



// Async thunk


// bookingSlice.ts
export const getstartjourney = createAsyncThunk(
  "form/startjourney",
  async (
   { bookingId }: { bookingId: string },
    { rejectWithValue }
  ) => {
    try {
     const url = `/api/v1/booking/${bookingId}/status/started`;

      const response = await api.getEvents(url);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getpickup = createAsyncThunk(
  "form/pickup",
  async (
   { bookingId }: { bookingId: string },
    { rejectWithValue }
  ) => {
    try {
     const url = `/api/v1/booking/${bookingId}/status/pickup`;

      const response = await api.getEvents(url);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getjourneycompleted = createAsyncThunk(
  "form/completed",
  async (
   { bookingId }: { bookingId: string },
    { rejectWithValue }
  ) => {
    try {
     const url = `/api/v1/booking/${bookingId}/status/completed`;

      const response = await api.getEvents(url);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getdriverinfo = createAsyncThunk(
  "form/info",
  async (
   {venderdriver_name,venderdriver_phone ,bookingId}: { venderdriver_name: string , venderdriver_phone: string ,bookingId: string },
    { rejectWithValue }
  ) => {
    try {
     const url = `/api/v1/booking/${bookingId}/vender_driver`;

      const response = await api.postEvents(url, {venderdriver_name, venderdriver_phone});

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Slice
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getstartjourney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getstartjourney.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedData = action.payload.booking;
        state.error = null;
      })
      .addCase(getstartjourney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     .addCase(getpickup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getpickup.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedData = action.payload.booking;
        state.error = null;
      })
      .addCase(getpickup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(getjourneycompleted.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getjourneycompleted.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedData = action.payload.booking;
        state.error = null;
      })
      .addCase(getjourneycompleted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     .addCase(getdriverinfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getdriverinfo.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedData = action.payload;
        state.error = null;
      })
      .addCase(getdriverinfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export default formSlice.reducer;
