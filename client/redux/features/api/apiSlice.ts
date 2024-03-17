import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLogin } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath: "api", // This is the name of the slice
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: () => ({
                url: "user/refresh-token",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        loadUser: builder.query({
            query: () => ({
                url: "user/me",
                method: "GET",
                credentials: "include" as const,
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLogin({
                            accessToken: result.data.activationToken,
                            user: result.data.user,
                        })
                    );
                } catch (error: any) {
                    console.error("Error logging in:", error);
                }
            },
        }),
    }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
