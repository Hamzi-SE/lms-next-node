import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseApi";
import Loader from "../../Loader/Loader";

type Props = {};

const AllCourses = (props: Props) => {
    const { theme, setTheme } = useTheme();

    const { isLoading, data, error } = useGetAllCoursesQuery({});

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "title", headerName: "Course Title", flex: 1 },
        { field: "ratings", headerName: "Ratings", flex: 0.5 },
        { field: "purchased", headerName: "Purchased", flex: 0.5 },
        { field: "created_at", headerName: "Created At", flex: 0.5 },
        {
            field: "edit",
            headerName: "Edit",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <Button>
                        <AiOutlineEdit className="dark:text-white text-black" size={20} />
                    </Button>
                );
            },
        },
        {
            field: "delete",
            headerName: "Delete",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <Button>
                        <AiOutlineDelete className="dark:text-white text-black" size={20} />
                    </Button>
                );
            },
        },
    ];

    let rows: any = [];

    data &&
        data?.courses?.forEach((course: any) => {
            rows.push({
                id: course._id,
                title: course.name,
                ratings: course.ratings,
                purchased: course.purchased,
                created_at: new Date(course.createdAt).toDateString(),
            });
        });

    return (
        <div className="mt-28">
            <Box m="20px">
                {isLoading ? (
                    <Loader />
                ) : (
                    <Box
                        m="40px 0 0 0"
                        height="80vh"
                        sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                                outline: "none",
                            },
                            "& .css-pgjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-sortIcon": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-row": {
                                color: theme === "dark" ? "#fff" : "#000",
                                borderBottom:
                                    theme === "dark"
                                        ? "1px solid #ffffff1f !important"
                                        : "1px solid #ccc !important",
                            },
                            "& .MuiTablePagination-root": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            "& .name-column--cell": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                borderBottom: "none",
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                borderTop: "none",
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiCheckbox-root": {
                                color:
                                    theme === "dark"
                                        ? "#B7EBDE !important"
                                        : "#000 !important",
                            },
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: "#fff !important",
                            },
                        }}
                    >
                        <DataGrid checkboxSelection rows={rows} columns={columns} />
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default AllCourses;
