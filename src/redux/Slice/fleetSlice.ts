

import { api } from "@/services/EventServices";
import { Cars } from "@/types/fleet";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";





interface CarState {
  cars:Cars[];
  selectedCars: Cars | null;
  loading: boolean;
  error: string | null;
 
 
//   // Define the correct type here
}

const initialState: CarState = {
  cars: [],
  loading: false,
  error: null,
  selectedCars: null,
};






export const CreateCars = createAsyncThunk(
  "car/create",
  async (
    {data }: {  data: FormData},
    { rejectWithValue }
  ) => {
    try {
        console.log("Created:",data)
    //   const userId = localStorage.getItem("userid");
      const url = "/api/v1/cars";
      const response = await api.postEvents(url, data, {headers: { "Content-Type": "multipart/form-data" }});
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Car creation failed"
        );
      }
    }
  }
);

export const getCars = createAsyncThunk(
  "cars/get",
  async (
   _,
  ) => {
    
    try {
    //   const userId = localStorage.getItem("userid");
    const url = "/api/v1/cars/list";

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

export const Updatecars = createAsyncThunk(
  "car/update",
  async (
    {data ,carId}: {carId:string;  data: FormData},
    { rejectWithValue }
  ) => {
    try {
        console.log("carId",carId)
    //   const userId = localStorage.getItem("userid");
      const url = `/api/v1/cars/update/${carId}`;
      const response = await api.patchEvent(url, data, {headers: { "Content-Type": "multipart/form-data" }});
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Car Updation failed"
        );
      }
    }
  }
);



export const Deletecars = createAsyncThunk(
  "car/delete",
  async (
    {carId}: {carId: string},
  ) => {
    try {
      // const userId = localStorage.getItem("userid");
      const url = `/api/v1/cars/delete/${carId}`;
      const response = await api.deleteEvents(url);
      const deleteData = response.data;
      return deleteData;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error|| "list view fetching failed";
      }
      return "An unexpected error occurred.";
    }
  }
);









const fleetSlice = createSlice({
  name: "fleet",
  initialState,
  reducers: {
    addCars: (state, action: PayloadAction<Cars>) => {
    //   state.tasks.push({
    //     ...action.payload,
    //     startDate: new Date(action.payload.startDate).toISOString(),
    //     endDate: new Date(action.payload.endDate).toISOString(),
    //     status: action.payload.status, // Ensure this matches "NotStarted" | "InProgress" | "Completed"
    //     taskCost: action.payload.taskCost || "0",
    //   });
    },
    updateCars: (state, action: PayloadAction<Cars>) => {
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
    setCars: (state, action: PayloadAction<Cars[]>) => {
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
         .addCase(CreateCars.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(CreateCars.fulfilled, (state, action) => {
            state.loading = false;
           
            console.log("action.payload", action.payload);
            state.error = null;
          })
          .addCase(CreateCars.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          }) 

        .addCase(getCars.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getCars.fulfilled, (state, action) => {
            state.loading = false;
            state.cars = action.payload.message;
           
            console.log("action.payload", action.payload);
            state.error = null;
          })
          .addCase(getCars.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          }) 

          
        .addCase(Updatecars.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(Updatecars.fulfilled, (state, action) => {
            state.loading = false;
            state.cars = action.payload.message;
           
            console.log("action.payload", action.payload);
            state.error = null;
          })
          .addCase(Updatecars.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          }) 

        .addCase(Deletecars.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(Deletecars.fulfilled, (state, action) => {
            state.loading = false;
           
           
            console.log("action.payload", action.payload);
            state.error = null;
          })
          .addCase(Deletecars.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          }) 



        



          
       
   } 
});

export const { addCars, updateCars, setCars } = fleetSlice.actions;
export default fleetSlice.reducer;
