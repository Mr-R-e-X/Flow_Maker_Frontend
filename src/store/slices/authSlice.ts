import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface user {
  _id: string;
  name: string;
  email: string;
  role: string;
}


interface auth {
  user: user | null;
  loader: boolean;
  userExists: boolean;
  leadsList: [];
  templatesList: [];
  sequenceList: [];
}

const initialState: auth = {
  user: null,
  loader: true,
  userExists: false,
  leadsList: [],
  templatesList: [],
  sequenceList: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.loader = false;
      state.userExists = true;
    },
    logout: (state) => {
      state.user = null;
      state.userExists = false;
    },
    setProfile: (state, action: PayloadAction<user>) => {
      state.user = action.payload;
      state.loader = false;
      state.userExists = true;
    },
    setUserExists: (state, action: PayloadAction<boolean>) => {
      state.userExists = action.payload;
      state.loader = false;
    },
  },
});

export const { login, logout, setProfile, setUserExists } = authSlice.actions;

export default authSlice.reducer;
