

import { api } from "@/services/EventServices";
import { Drivers } from "@/types/driver";
import { Cars } from "@/types/fleet";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";





interface CarState {
  drivers: Drivers[];
  selectedDrivers: Drivers | null;
  loading: boolean;
  error: string | null;


  //   // Define the correct type here
}

const initialState: CarState = {
  drivers: [],
  loading: false,
  error: null,
  selectedDrivers: null,
};






export const CreateDrivers = createAsyncThunk(
  "driver/create",
  async (
    { data }: { data: FormData },
    { rejectWithValue }
  ) => {
    try {
      console.log("Created:", data)
      //   const userId = localStorage.getItem("userid");
      const url = "/api/v1/driver";
      const response = await api.postEvents(url, data, { headers: { "Content-Type": "multipart/form-data" } });
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

export const getDrivers = createAsyncThunk(
  "driver/get",
  async (
    _,
  ) => {

    try {
      //   const userId = localStorage.getItem("userid");
      const url = "/api/v1/driver/list";

      const response = await api.getEvents(url);
      const driverData = response.data;
      return driverData;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error || "driver details fetching failed";
      }
      return "An unexpected error occurred.";
    }
  }
);

export const UpdateDrivers = createAsyncThunk(
  "driver/update",
  async (
    { data, driverId }: { driverId: string; data: FormData },
    { rejectWithValue }
  ) => {
    try {
      console.log("Updating driver:", driverId);
      for (const [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }
 
      const url = `/api/v1/driver/${driverId}`;
      const response = await api.patchEvent(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Update response:", response.data);
      return response.data; // Should be the updated driver object
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Driver update failed"
        );
      }
      return rejectWithValue("Unexpected error during update");
    }
  }
);














const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    addDrivers: (state, action: PayloadAction<Drivers>) => {
      //   state.tasks.push({
      //     ...action.payload,
      //     startDate: new Date(action.payload.startDate).toISOString(),
      //     endDate: new Date(action.payload.endDate).toISOString(),
      //     status: action.payload.status, // Ensure this matches "NotStarted" | "InProgress" | "Completed"
      //     taskCost: action.payload.taskCost || "0",
      //   });
    },
    updateDrivers: (state, action: PayloadAction<Drivers>) => {
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
    deleteDrivers: (state, action: PayloadAction<number>) => {
      //   state.tasks = state.tasks.filter((task) => task.ID !== action.payload);
    },
    setDrivers: (state, action: PayloadAction<Drivers[]>) => {
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
      .addCase(CreateDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateDrivers.fulfilled, (state, action) => {
        state.loading = false;

        console.log("action.payload.driver", action.payload);
        state.error = null;
      })
      .addCase(CreateDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.message;

        console.log("action.payload.driver", action.payload);
        state.error = null;
      })
      .addCase(getDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(UpdateDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
       .addCase(UpdateDrivers.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.drivers = state.drivers.map((driver) =>
          driver.id === action.payload.id ? action.payload : driver
        ); // Update the driver in the list (or modify this as per your state structure)
      })
      .addCase(UpdateDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // .addCase(Deletecars.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(Deletecars.fulfilled, (state, action) => {
    //     state.loading = false;


    //     console.log("action.payload", action.payload);
    //     state.error = null;
    //   })
    //   .addCase(Deletecars.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   }) 









  }
});

export const { addDrivers, updateDrivers, setDrivers } = driverSlice.actions;
export default driverSlice.reducer;
