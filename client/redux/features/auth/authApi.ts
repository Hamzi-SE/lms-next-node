import { apiSlice } from "../api/apiSlice";
import { userLogin, userRegistration } from "./authSlice";

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
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "user/login",
                method: "POST",
                body: { email, password },
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
                    console.error("Error registering user:", error);
                }
            },
        }),
        socialAuth: builder.mutation({
            query: ({ email, name, avatar }) => ({
                url: "user/social-auth",
                method: "POST",
                body: { email, name, avatar },
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

export const {
    useRegisterMutation,
    useActivationMutation,
    useLoginMutation,
    useSocialAuthMutation,
} = authApi;
