import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

const spsStore =configureStore({
    reducer:{
        loggedInUser:userSlice.reducer
    }
})

export default spsStore