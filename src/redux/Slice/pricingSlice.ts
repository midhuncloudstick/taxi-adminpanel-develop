import { api } from "@/services/EventServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PeakDay, Pricing } from '@/types/pricing'




interface PeakDayPriceState {
  price: Pricing;

  loading: boolean;
  error: string | null;


}

const initialState: PeakDayPriceState = {
  price: null,
  loading: false,
  error: null,

};

export const getPricing = createAsyncThunk(
  "price/get",
  async (
   _,
    { rejectWithValue }
  ) => {
    try {
     const url = "/api/v1/pricing";

      const response = await api.getEvents(url);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const getpeakdaypricing = createAsyncThunk(
  "price/getpeakdaypricing",
  async (
   { rate1,rate2,rate3,rate4,peak_days }: { rate1:number,rate2:number,rate3:number,rate4:number,peak_days:string[]},
    { rejectWithValue }
  ) => {
    try {
     const url = "api/v1/pricing";

      const response = await api.patchEvent(url,{peak_days,rate1,rate2,rate3,rate4});

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getpeakdaypricing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getpeakdaypricing.fulfilled, (state, action) => {
        state.loading = false;
        state. price= action.payload.message;
        state.error = null;
      })
      .addCase(getpeakdaypricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

        .addCase(getPricing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPricing.fulfilled, (state, action) => {
        state.loading = false;
        state. price= action.payload.message;
        state.error = null;
      })
      .addCase(getPricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pricingSlice.reducer;