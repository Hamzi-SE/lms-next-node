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
    }),
});

export const { useUpdateAvatarMutation } = userApi;
