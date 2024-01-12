import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { User } from "@/types";

type SetUserPayload = {
    user: User;
    access_token: string;
};

type InitialState = {
    user?: User;
    jwtToken: string;
    isLoggedIn: boolean;
};

const initialState: InitialState = {
    jwtToken: "",
    isLoggedIn: false,
};

const usersSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateLoginInfo: (state, action: PayloadAction<SetUserPayload>) => {
            state.user = action.payload.user;
            state.jwtToken = action.payload?.access_token || "";
            state.isLoggedIn = true;

            localStorage.setItem("token", action.payload?.access_token);
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
    },
});

export const { setUser, updateLoginInfo } = usersSlice.actions;

export default usersSlice.reducer;
