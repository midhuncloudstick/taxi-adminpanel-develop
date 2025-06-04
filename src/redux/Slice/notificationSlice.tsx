import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Alert {
  bookingId: string;
  pickupTime: string;
  message: string;
}

interface NotificationState {
  messages: Alert[];
}

const initialState: NotificationState = {
  messages: [],
};

const notificationSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Alert>) => {
      console.log("webbbbbbbbbbbbbbbbbb")
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearMessages } = notificationSlice.actions;
export default notificationSlice.reducer;
