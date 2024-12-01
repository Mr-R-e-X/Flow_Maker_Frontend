import { configureStore } from "@reduxjs/toolkit";
import formSlice from "./slices/formslice";
import authSlice from "./slices/authSlice";
import flowSlice from "./slices/flowChartSlice";
import listSlice from "./slices/listSlice";
import templateSlice from "./slices/templateSlice";

export const store = configureStore({
  reducer: {
    form: formSlice,
    auth: authSlice,
    flow: flowSlice,
    list: listSlice,
    template: templateSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
