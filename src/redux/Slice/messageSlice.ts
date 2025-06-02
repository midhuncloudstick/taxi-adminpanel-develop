import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '@/services/EventServices'; // make sure this is correctly exported
import { Car,User,VenderDriver,Booking,Driver} from '@/types/form'
import { Message } from '@/types/message'
// Interfaces


interface messageState {
  loading: boolean;
  error: string | null;
 messages:Message;
  
 
}

// Initial state
const initialState: messageState = {
  loading: false,
  error: null,
  messages:null
 
};


// bookingSlice.ts
export const getMessage = createAsyncThunk(
  "form/startjourney",
  async (
  _,
    { rejectWithValue }
  ) => {
    try {
     const url = "/api/v1/user/message/list";

      const response = await api.getEvents(url);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);




// Slice
const messageSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.booking;
        state.error = null;
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


  },
});

export default messageSlice.reducer;
