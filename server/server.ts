require("dotenv").config();
import connectDB from "./utils/db";
import { app } from "./app";

// create server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
    connectDB();
});
