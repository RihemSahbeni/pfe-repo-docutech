import { createSlice } from "@reduxjs/toolkit";

export const HistorySlice = createSlice({
  name: "History",
  initialState:[{
    id: "none",
    doctitle: "none",
    description: "none",
    creation_date: "none",
    user_id: "none",
    user_firstname: "none",
    user_lastname: "none",
   
    
  }],
  reducers: {
    setHistory:(state,actions)=>{
        return actions.payload
    }

  },
});

// Action creators are generated for each case reducer function
export const {setHistory} = HistorySlice.actions;

export default HistorySlice.reducer;
