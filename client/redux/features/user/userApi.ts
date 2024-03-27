import { apiSlice } from "../api/apiSlice";
import { userLogin, userUpdate } from "../auth/authSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: "user/update-avatar",
                method: "PUT",
                body: { avatar },
                credentials: "include" as const,
            }),

            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userUpdate({
                            user: result.data.user,
                        })
                    );
                } catch (error: any) {
                    console.error("Error updating avatar:", error);
                }
            },
        }),

        editProfile: builder.mutation({
            query: ({ name }) => ({
                url: "user/update-profile",
                method: "PUT",
                body: { name },
                credentials: "include" as const,
            }),

            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userUpdate({
                            user: result.data.user,
                        })
                    );
                } catch (error: any) {
                    console.error("Error updating profile:", error);
                }
            },
        }),

        updatePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: "user/update-password",
                method: "PUT",
                body: { oldPassword, newPassword },
                credentials: "include" as const,
            }),

            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userUpdate({
                            user: result.data.user,
                        })
                    );
                } catch (error: any) {
                    console.error("Error updating password:", error);
                }
            },
        }),

        getAllUsers: builder.query({
            query: () => ({
                url: "user/admin-all",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useUpdateAvatarMutation,
    useEditProfileMutation,
    useUpdatePasswordMutation,
    useGetAllUsersQuery,
} = userApi;
