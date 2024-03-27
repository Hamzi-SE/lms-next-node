import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";

type Props = {
    isTeam: boolean;
};

const AllCourses: React.FC<Props> = ({ isTeam }) => {
    const [active, setActive] = useState(false);

    const { theme, setTheme } = useTheme();

    const { isLoading, data, error } = useGetAllUsersQuery({});

    const columns = [
        { field: "id", headerName: "ID", flex: 0.4 },
        { field: "name", headerName: "Name", flex: 0.5 },
        { field: "email", headerName: "Email", flex: 0.5 },
        { field: "role", headerName: "Role", flex: 0.3 },
        { field: "purchased_courses", headerName: "Purchased Courses", flex: 0.3 },
        { field: "created_at", headerName: "Joined At", flex: 0.5 },
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
        // send email
        {
            field: "send_email",
            headerName: "Send Email",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <Button href={`mailto:${params.row.email}`} target="_blank">
                        <AiOutlineMail className="dark:text-white text-black" size={20} />
                    </Button>
                );
            },
        },
    ];

    let rows: any = [];

    if (isTeam) {
        const newData = data && data?.users?.filter((user: any) => user.role === "admin");

        newData &&
            newData?.forEach((user: any) => {
                rows.push({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    purchased_courses: user.courses?.length,
                    created_at: new Date(user.createdAt).toDateString(),
                });
            });

        // remove the purchase courses column
        columns.splice(4, 1);
    } else {
        data &&
            data?.users?.forEach((user: any) => {
                rows.push({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    purchased_courses: user.courses?.length,
                    created_at: new Date(user.createdAt).toDateString(),
                });
            });
    }

    return (
        <div className="mt-28">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    <div className="w-full flex justify-end">
                        <div
                            className={`${styles.button} w-52`}
                            onClick={() => setActive(!active)}
                        >
                            Add New Member
                        </div>
                    </div>
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
                </Box>
            )}
        </div>
    );
};

export default AllCourses;
