import express from "express";
import {createUSer, getUserByName} from "./helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

async function genHashedPassword(password){
    const no_of_rounds = 10;
    const salt = await bcrypt.genSalt(no_of_rounds);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
  }

router.post('/signup', async function (req, res) {
    const {email,password,userName} = req.body[0];
    console.log(req.body);
    console.log(email,password,userName);
    const userFromDB = await getUserByName(email);

      if(userFromDB){
        res.status(400).send({"message" : "Email already exists", "emailError": true});
      }else if(password.length < 8){
        res.status(400).send({"message" : "Password should be minimum of 8 characters", "passwordError": true});
      }else{
        const hashedPassword = await genHashedPassword(password);
        const result = await createUSer({email : email , password : hashedPassword, userName: userName, coursesUndertaken : [], tasksCompleted : []});
        console.log(hashedPassword);
        res.send(result);
      }
  })


  router.post('/login',async function (req, res) {

    
      const {email,password} = req.body[0];
      const userFromDB = await getUserByName(email);
      console.log(userFromDB);
      var passwordMatch;
      if(userFromDB){
        const storedPassword = userFromDB.password;
        passwordMatch = await bcrypt.compare(password,storedPassword);
        console.log(passwordMatch);
      }
    

      if(!userFromDB){
        res.status(401).send({"message" : "Invalid Credentials"});
      }else if(!passwordMatch){
        res.status(401).send({"message" : "Invalid Credentials"});
      }else{
        const token = jwt.sign({id : userFromDB._id},process.env.secretKey);
        res.send({"message" : "Successful Login", token : token, name: userFromDB.userName, id : userFromDB._id });
        // console.log(res.name,req.body[0]);
      }
  })    



  export const userRouter = router;