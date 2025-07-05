import { configureStore } from "@reduxjs/toolkit";
import defaultReducer from '../redux/defaultSlice';


export const store=configureStore({
    reducer:{
        reducerX:defaultReducer,
    },
});

export const AppDispatch=typeof store.dispatch;
export const RootState=typeof store;