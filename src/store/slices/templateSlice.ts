import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface template {
  _id: string;
  name: string;
  subject: string;
  body: string;
}

interface templateState {
  templateList: template[];
}

const initialState: templateState = {
  templateList: [],
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplateList: (state, action: PayloadAction<template[]>) => {
      state.templateList = action.payload;
    },
    removeTemplate: (state, action: PayloadAction<string>) => {
      state.templateList = state.templateList.filter(
        (template) => template._id !== action.payload
      );
    },
  },
});

export const { setTemplateList, removeTemplate } = templateSlice.actions;

export default templateSlice.reducer;
