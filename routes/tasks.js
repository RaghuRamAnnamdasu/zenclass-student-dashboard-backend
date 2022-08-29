import express from "express";
import { client } from "../index.js";
import {ObjectId} from "mongodb";

const router = express.Router();


router.get("/getAllTasks",async function(req,res){
    const coursesData = await client.db("zenStudentDashboard").collection("tasks").find().toArray();
    res.send(coursesData);
})

router.put("/postTaskSolutions/:taskDetails",async function(req,res){

    const taskSolution = req.body;
    const {taskDetails} = req.params;
    const {userName,...solution} = taskSolution;
    solution.taskName = taskDetails;
    console.log(taskSolution,userName);

    try{
        let userArray = await client.db("zenStudentDashboard").collection("users").find({userName : userName}).toArray();
        console.log(userArray)
        let tasksCompleted = userArray[0].tasksCompleted;

        const isTaskExists = tasksCompleted.find((value)=>value.taskName===taskDetails);

        if(!isTaskExists){
            userArray[0].tasksCompleted = [...tasksCompleted,solution];
        }else{
            // console.log(userArray[0].tasksCompleted, taskDetails);
            console.log(userArray[0].tasksCompleted)
            const arrayExcludingPrevSol = userArray[0].tasksCompleted.filter((value)=>value.taskName !== taskDetails);
            console.log(arrayExcludingPrevSol)
            userArray[0].tasksCompleted = [...arrayExcludingPrevSol,solution];
            console.log("after",userArray[0].tasksCompleted);
        }

        const result = await client.db("zenStudentDashboard").collection("users").updateOne({userName : userName},{$set: {tasksCompleted : userArray[0].tasksCompleted}});
        console.log(result)
        res.send(result);
    }catch(error){
        res.status(404).send("User Name did not found or ", error)
    }
})


router.get("/userTasks/:userName",async function(req,res){
    const {userName} = req.params;
    const userDetails = await client.db("zenStudentDashboard").collection("users").find({userName : userName}).toArray();
    const userTasks = userDetails[0].tasksCompleted;
    res.send(userTasks);
})




export const tasksRouter = router;