import express from "express"
import ExperienceModel from "../../db/models/experience/ExperienceModel.js"
import createHttpError from "http-errors"

const router = express.Router()

router.post("/:userName/experiences", async (req,res,next) => {
    try {
        const experienceToAdd = {...req.body}

        const newExperience = await ExperienceModel.findByIdAndUpdate(
            req.params.userName,
            {$push: {experiences: experienceToAdd}},
            {new: true}
        )
        if(newExperience){
            res.send(newExperience)
        }else{
            next(createHttpError(404, `User with ${req.params.userName} is not found`))
        }
    } catch (error) {
        next(error)
    }
})

router.get("/:userName/experiences", async (req,res,next) => {
    try {
        const experiences = await ExperienceModel.findById(req.params.userName)
        if(experiences){
            res.send(experiences)
        }else{
            next(createHttpError(404, `User with ${req.params.userName} is not found`))
        }
    } catch (error) {
        
    }
})

router.get("/:userName/experiences/:expId", async (req,res,next) => {
    try {
        const experience = await ExperienceModel.findById(req.params.userName)
        if(experience){
            const experienceToAdd = experience.experiences.find(e => e._id.toString() === req.params.expId)
            if(experienceToAdd){
                res.send(experienceToAdd)
            }else{
                next(createHttpError(404, `Experience with id ${req.params.expId} is not found`))
            }
        }else{
            next(createHttpError(404 `User with ${req.params.userName} is not found`))
        }
    } catch (error) {
        next(error)
    }
})

router.put("/:userName/experiences/:expId", async (req,res,next) => {
    try {
        const experience = await ExperienceModel.findById(req.params.userName)

        if(experience) {
            const index = experience.experiences.findIndex(e => e._id.toString() === req.params.expId)

            if(index !== -1){
                experience.experiences[index] = {...experience.comment[index].toObject(), ...req.body}
                await experience.save()
                res.send(experience)
            }else{
                next(createHttpError(404, `Experience with id ${req.params.expId} is not found`))
            }
        }else{
            next(createhttpError(404, `User with ${req.params.userName} is not found`))
        }
    } catch (error) {
        next(error)
    }
})

router.delete("/:userName/experiences/:expId", async (req,res,next) => {
    try {
        experienceToDelete = await ExperienceModel.findByIdAndUpdate(
            req.params.userName,
            {$pull: {experiences: {_id: req.params.expId}}},
            {new: true}
        )
        if(experienceToDelete){
            res.send(experienceToDelete)
        }else{
            next(createHttpError(404, `User with ${req.params.userName} is not found`))
        }
    } catch (error) {
        next(error)
    }
})

router.post("/:userName/experiences/:expId/picture", async (req,res,next) => {
    try {
           
    } catch (error) {
        
    }
})

router.get("/:userName/experiences/CSV", async (req,res,next) => {
    try {
        
    } catch (error) {
        
    }
})

export default router