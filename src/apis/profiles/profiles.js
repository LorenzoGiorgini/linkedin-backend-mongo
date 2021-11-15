import express from "express"
import profileModel from "../../db/models/profile/ProfileModel.js"
import createHttpError from "http-errors"


const profileRouter = express.Router()

// me profile
profileRouter.get("/me", async(req,res,next)=>{
    try {
   
       const profile = await profileModel.find({name:"rashmi", surname:"hiremath"})
        res.status(200).send( profile)
        
    } catch (error) {
       next(error) 
    }
})



// post rofile
profileRouter.post("/", async(req,res,next)=>{
    try {
        const profile = await profileModel(req.body)
        const {_id} = await profile.save()
        res.status(201).send( {_id})
        
    } catch (error) {
       next(error) 
    }
})

// to get all profiles
profileRouter.get("/", async(req,res,next)=>{
    try {
        const profiles = await profileModel.find()
     
            res.send(profiles)
        
    } catch (error) {
       next(error) 
    }
})

// get single profile by id
profileRouter.get("/:profileId", async(req,res,next)=>{
    try {
        const id = req.params.profileId
        const profile = await profileModel.findById(id)
        if(profile){
            res.send(profile)
        }else{
            next(createHttpError(404, `profile with id ${id} not found!`));
        }
        
    } catch (error) {
       next(error) 
    }
})

// update single profile by id
profileRouter.put("/:profileId", async(req,res,next)=>{
    try {
        const id = req.params.profileId
        const profile = await profileModel.findByIdAndUpdate(id,req.body,{new:true})
        if(profile){
            res.send(profile)
        }else{
            next(createHttpError(404, `profile with id ${id} not found!`));
        }
        
    } catch (error) {
       next(error) 
    }
})

// delete single profile by id
profileRouter.delete("/:profileId", async(req,res,next)=>{
    try {
        const id = req.params.profileId
        const deleteProfile = await profileModel.findByIdAndDelete(id)
        if(deleteProfile){
            res.status(204).send("Deleted successfully")
        }else{
            next(createHttpError(404, `profile with id ${id} not found!`));
        }
        
    } catch (error) {
       next(error) 
    }
})

export default profileRouter