

import { api } from "@/services/EventServices";
import { Cars } from "@/types/fleet";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


interface History{

}


interface CarState {
  history:History[];
  selectedHistory: History | null;
  loading: boolean;
  error: string | null;
 
 
//   // Define the correct type here
}

const initialState: CarState = {
  history: [],
  loading: false,
  error: null,
  selectedHistory: null,
};








export const histories = createAsyncThunk(
  "cars/get",
  async (
   _,
  ) => {
    
    try {
    //   const userId = localStorage.getItem("userid");
    const url = "/api/v1/history";

      const response = await api.getEvents(url);
      const fleetData = response.data;
      return fleetData;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error|| "car details fetching failed";
      }
      return "An unexpected error occurred.";
    }
  }
);















const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addCars: (state, action: PayloadAction<History>) => {
    //   state.tasks.push({
    //     ...action.payload,
    //     startDate: new Date(action.payload.startDate).toISOString(),
    //     endDate: new Date(action.payload.endDate).toISOString(),
    //     status: action.payload.status, // Ensure this matches "NotStarted" | "InProgress" | "Completed"
    //     taskCost: action.payload.taskCost || "0",
    //   });
    },
    updateCars: (state, action: PayloadAction<History>) => {
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
    setCars: (state, action: PayloadAction<History[]>) => {
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
    

        .addCase(histories.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(histories.fulfilled, (state, action) => {
            state.loading = false;
            state.history = action.payload.message;
           
            console.log("action.payload", action.payload);
            state.error = null;
          })
          .addCase(histories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          }) 

 



        



          
       
   } 
});

export const { addCars, updateCars, setCars } = historySlice.actions;
export default historySlice.reducer;
