import { apiSlice } from "../api/apiSlice";
import { userRegistration } from "./authSlice";

type RegistrationResponse = {
    message: string;
    activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "user/register",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userRegistration({
                            token: result.data.activationToken,
                        })
                    );
                } catch (error: any) {
                    console.error("Error registering user:", error);
                }
            },
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "user/activate",
                method: "POST",
                body: { activation_token, activation_code },
                credentials: "include" as const,
            }),
        }),
    }),
});

export const { useRegisterMutation, useActivationMutation } = authApi;
