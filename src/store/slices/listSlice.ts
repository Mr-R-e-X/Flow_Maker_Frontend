import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface singeList {
  _id: string;
  name: string;
  file: {
    publicId: string;
    url: string;
  };
}

export interface ListState {
  currentList: singeList;
  leadSourceList: singeList[];
}

const initialState: ListState = {
  currentList: {
    _id: "",
    name: "",
    file: {
      publicId: "",
      url: "",
    },
  },
  leadSourceList: [],
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setList: (state, action: PayloadAction<singeList[]>) => {
      state.leadSourceList = action.payload;
    },
    setCurrentList: (state, action: PayloadAction<singeList>) => {
      state.currentList = action.payload;
    },
    removeItemFromList: (state, action: PayloadAction<string>) => {
      state.leadSourceList = state.leadSourceList.filter((item) => {
        return item._id !== action.payload;
      });
    },
  },
});

export const { setList, setCurrentList, removeItemFromList } =
  listSlice.actions;

export default listSlice.reducer;
