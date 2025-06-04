import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

export interface Alert {
  bookingId: string;
  pickupTime: string;
  message: string;
}
export interface notifictiontype {
  id: string;
  location: string;
  pickuptime: string;
}

interface NotificationState {
  messages: Alert[];
  notification: notifictiontype[];
  toglelistId :string,
}

const initialState: NotificationState = {
  messages: [],
  notification: [],
  toglelistId:''
};

const notificationSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Alert>) => {
      state.messages.push(action.payload);
    },
    addNotification: (state, action) => {
      console.log("====================================");
      console.log(action.payload);
      console.log("====================================");

      const payload = action.payload;

      const idMatch = payload.match(/ID:\s*(\S+)/);
      const locationMatch = payload.match(/Location:\s*(.+)/);
      const timeMatch = payload.match(/Time:\s*(.+)/);

      const notification = {
        id: idMatch ? idMatch[1] : "",
        location: locationMatch ? locationMatch[1] : "",
        pickuptime: timeMatch ? timeMatch[1] : "",
      };

      state.notification.push(notification);
    },
    setToggleid :(state,action)=>{
      state.toglelistId = action.payload
    },
    clearMessages: (state) => {
      state.messages = [];
    },
   clearnotification: (state, action) => {
  const itemIndex = state.notification.findIndex(
    (b) => b.id === action.payload
  );
  if (itemIndex !== -1) {
    state.notification.splice(itemIndex, 1); // 🔥 mutate state directly
  }
}
  },
});

export const { addMessage, clearMessages, addNotification ,setToggleid,clearnotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
