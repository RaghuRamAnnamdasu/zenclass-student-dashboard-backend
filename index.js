import express from "express";
import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { coursesRouter } from "./routes/courses.js";
import cors from "cors";
import { userRouter } from "./routes/users.js";
import { classesRouter } from "./routes/classes.js";
import { tasksRouter } from "./routes/tasks.js";
import { classesData, courseData, taskData, } from "./data.js";
import { countRouter } from "./routes/count.js";

const app = express();
dotenv.config(); 
// app.use(cors());
app.use(
        cors({
          origin: "*",
          credentials: true
        })
      );
// app.use((req, res, next) => {
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         res.header(
//           "Access-Control-Allow-Headers",
//           "Origin, X-Requested-With, Content-Type, Accept"
//         );
//         next();
//       });

// app.use(function(req, res, next) {
//     res.header(
//         "Access-Control-Allow-Headers",
//         "x-auth-token, Origin, Content-Type, Accept"
//     );
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-control-Allow-Methods", "GET, POST, PUT");
//     res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With, content-type,Accept,Authorization");
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
// });

app.use(express.json());

const port = process.env.PORT || 4000;

const mongo_URL = process.env.Mongo_URL;

async function createConnection(){
    const client = new MongoClient(mongo_URL);
    await client.connect();
    // console.log(client);
    console.log("Mongo is connected");
    return client;
}

export const client = await createConnection();

app.get("/", async function(request,response){
    response.send("Hi, Welcome to Capstone...!!!")
})

app.use("/courses",coursesRouter);
app.use("/users",userRouter);
app.use("/classes",classesRouter);
app.use("/tasks",tasksRouter);
app.use("/count",countRouter);




// await client.db("zenStudentDashboard").collection("courses").insertMany(courseData);
// await client.db("zenStudentDashboard").collection("tasks").insertMany(taskData);


app.listen(port,()=>console.log(`App has started in port ${port}`));