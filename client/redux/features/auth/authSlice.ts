import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    user: {},
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action) => {
            state.token = action.payload.token;
        },
        userLogin: (state, action) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLogout: (state) => {
            state.token = "";
            state.user = {};
        },
    },
});

export const { userRegistration, userLogin, userLogout } = authSlice.actions;

export default authSlice;
