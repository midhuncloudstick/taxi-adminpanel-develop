import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '@/services/EventServices'; // make sure this is correctly exported


// Interfaces
interface User {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  type:string;
  address: string;
}
 interface Admin{
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  type: "admin" | "user" | string; 
  profile_image: string;
  address: string;
 }




interface UserState {
  loading: boolean;
  error: string | null;
  user:User[]|null;
  admin:Admin[]|null;
  selectedUser:User|null;
  
}

// Initial state
const initialState: UserState = {
  loading: false,
  error: null,
  user:null,
  selectedUser:null,
  admin:null
};



// Async thunk
export const CreateUser = createAsyncThunk(
  "user/create",
  async (
    { data }: { data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const url = "/api/v1/user";
      const response = await api.postEvents(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "User creation failed"
        );
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const AdminLogin = createAsyncThunk(
  "Admin/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const url = "/api/v1/user/admin-login";

      const response = await api.postEvents(url, { email, password });

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "User login failed"
        );
      }
      return rejectWithValue("Unknown login error");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgot",
  async (
    { email}: { email: string },
    { rejectWithValue }
  ) => {
    try {
      const url = "/api/v1/user/forgot-password";

      const response = await api.postEvents(url, { email });

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "forgot-passwordfailed"
        );
      }
      return rejectWithValue("Unknown forgot-password error");
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateUser.fulfilled, (state, action) => {
        state.loading = false;
        state. user= action.payload.message;
        state.error = null;
      })
      .addCase(CreateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(AdminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AdminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state. admin= action.payload;
        state.error = null;
      })
      .addCase(AdminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state. user= action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
  },
});

export default userSlice.reducer;
