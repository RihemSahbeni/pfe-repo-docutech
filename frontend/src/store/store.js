import { configureStore } from "@reduxjs/toolkit";
import ProjectSlice from "./ProjectSlice";
import UserSlice from "./UserSlice";
import DocSlice from "./DocSlice";

export const store = configureStore({
  reducer: { Project: ProjectSlice, User: UserSlice,Doc:DocSlice },
});
