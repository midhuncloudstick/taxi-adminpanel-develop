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
 page:any;
 total_pages:any;
  
 
}

// Initial state
const initialState: messageState = {
  loading: false,
  error: null,
  messages:null,
  page:null,
  total_pages:null,

 
};


// bookingSlice.ts
export const getMessage = createAsyncThunk(
  "message/startjourney",
  async (
    { page, limit }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const url = `/api/v1/user/message/list?page=${page}&limit=${limit}`;
      const response = await api.getEvents(url);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);





// Slice
const messageSlice = createSlice({
  name: 'message',
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
        state.messages = action.payload.message;
          state.page = action.payload.page;
        state.total_pages = action.payload.total_pages
        state.error = null;
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


  },
});

export default messageSlice.reducer;
