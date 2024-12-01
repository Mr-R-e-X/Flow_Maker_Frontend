import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  name: string;
  email: string;
}

const initialState: FormState = {
  name: "",
  email: "",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<FormState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
});

export const { setFormData } = formSlice.actions;

export default formSlice.reducer;
