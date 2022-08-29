import express from "express";
import { client } from "../index.js";
import {ObjectId} from "mongodb";

const router = express.Router();

router.get("/getClassById/:id",async (req,res)=>{
    const {id} = req.params;
    // console.log(id, typeof(id),ObjectId(+id));
    const classData = await client.db("zenStudentDashboard").collection("classes").find({_id: ObjectId(id)}).toArray();
    console.log(id, classData);
    classData.length ? res.send(classData[0]) : res.status(404).send({message : "Class Data not found"});
})


router.get("/getAllClasses",async (req,res)=>{
    const classesData = await client.db("zenStudentDashboard").collection("classes").find().toArray();
    classesData.length ? res.send(classesData) : res.status(404).send({message : "Classes Data not found"});
})



export const classesRouter = router;