import { api } from "@/services/EventServices";
import { Booking } from "@/types/booking";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
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
  toglelistId :string;
  ringnotification:boolean;
  alretList:Booking[];
  loading:boolean;
  error: string| null;
}

const initialState: NotificationState = {
  messages: [],
  notification: [],
  toglelistId:'',
  ringnotification:false,
  alretList:[],
  loading:null,
  error:null
};

export const notificationRead = createAsyncThunk(
  "notifictaion/notificationRead",
  async (
    id:string,
  ) => {

    try {
      const url = `/api/v1/booking/${id}`;

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


// export const markAsRead = createAsyncThunk(
//   "booking/markasread",
//   async (
//    bookingid:string , {rejectWithValue}
//   ) => {

//     try {
//       const url = `/api/v1/booking/${bookingid}`;

//       const response = await api.getEvents(url);
//       const markasread = response.data;
//       return markasread;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return error || "booking details fetching failed";
//       }
//       return "An unexpected error occurred.";
//     }
//   }
// );

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
      state.ringnotification = true
    },
    addAlert:(state,action)=>{
      console.log('====================================');
      console.log('alretclaaed',action.payload);
      console.log('====================================');
      state.alretList=action.payload 
    },
    setToggleid :(state,action)=>{

      state.toglelistId = action.payload
   
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearalert:(state,action)=>{
 
         state.alretList.splice(action.payload, 1);
    
   
    },
    setnotificationsoundfasle :(state)=>{
      state.ringnotification =false
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

   extraReducers: (builder) => {
    builder
  

      //  .addCase(markAsRead.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })

      // .addCase(markAsRead.fulfilled, (state, action) => {
      //   state.loading = false;
    

      //   state.error = null;
      // })
      // .addCase(markAsRead.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })
  }
});

export const { addMessage, clearMessages, addNotification ,setToggleid,clearnotification ,setnotificationsoundfasle,addAlert,clearalert} =
  notificationSlice.actions;
export default notificationSlice.reducer;
