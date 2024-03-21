import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    user: "" as any,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
        },
        userLogin: (state, action: PayloadAction<{ accessToken: string; user: object }>) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLogout: (state) => {
            state.token = "";
            state.user = "";
        },
        userUpdate: (state, action: PayloadAction<{ user: object }>) => {
            state.user = action.payload.user;
        },
    },
});

export const { userRegistration, userLogin, userLogout, userUpdate } = authSlice.actions;

export default authSlice;
