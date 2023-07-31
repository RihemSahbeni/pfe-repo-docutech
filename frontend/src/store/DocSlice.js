import { createSlice } from "@reduxjs/toolkit";

export const DocSlice = createSlice({
  name: "Doc",
  initialState:[{
    id: "none",
       Name: "none",
    Status: "none",
    Type: "none",
   CreationDate: "none",
   

    
  }],
  reducers: {
    setDoc:(state,actions)=>{
        return actions.payload
    }

  },
});

// Action creators are generated for each case reducer function
export const {setDoc} = DocSlice.actions;

export default DocSlice.reducer;
