import { createSlice } from "@reduxjs/toolkit";

export const projectSlice = createSlice({
  name: "Project",
  initialState: [],
  reducers: {
    setProject: (state, actions) => {
      return actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;
