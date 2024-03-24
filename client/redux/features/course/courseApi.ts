import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: "courses/create",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
    }),
});

export const { useCreateCourseMutation } = courseApi;
