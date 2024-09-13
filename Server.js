import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DatabaseConnection } from './Database/Db.js';
import UserRouter from './Routers/UserRouter.js';
import TeacherRouter from './Routers/TeacherRouter.js'
import PrincipalRouter from './Routers/PrincipalRouter.js'

const app = express();
const PORT = 3500;

// Database connection
DatabaseConnection();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

// User Registration
app.use("/user", UserRouter);
//teacher router
app.use("/teacher",TeacherRouter);

app.use("/principal",PrincipalRouter);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
