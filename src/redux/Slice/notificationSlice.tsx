import {  createSlice } from '@reduxjs/toolkit';

// Interfaces


interface notificationState {
  loading: boolean;
  error: string | null;
 notification:{}
  
 
}

// Initial state
const initialState: notificationState = {
  loading: false,
  error: null,
 notification:null
 
}




// Slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
  
    getNotification : (state,data)=>{
  state.notification = data
    }
  },
  
});
export const { getNotification} = notificationSlice.actions

export default notificationSlice.reducer;
