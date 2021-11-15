import profileModel from "../../db/models/profile/ProfileModel.js";
import express from "express";
import ExperienceModel from "../../db/models/experience/ExperienceModel.js";
import createHttpError from "http-errors";


import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"

const router = express.Router();


const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "linkedin-experience-image"
	}
})

router.post("/:userName/experiences", async (req, res, next) => {
  try {
   
      const experience = new ExperienceModel(req.body)
      await experience.save();
      console.log(experience)
      const newExperience = await profileModel.findByIdAndUpdate(
        req.params.userName,
        { $push: { experiences: experience._id } },
        { new: true }
      );
      if (newExperience) {
        console.log(newExperience)
        res.send(newExperience);
      } else {
        next(createHttpError(404, `User with ${req.params.userName} is not found `))
      }
  } catch (error) {
    next(error);
  }
});

router.get("/:userName/experiences", async (req, res, next) => {
  try {
    const experiences = await profileModel.findById(req.params.userName).populate("experiences");
    if (experiences) {
      res.send(experiences.experiences);
    } else {
      next(
        createHttpError(404, `User with ${req.params.userName} is not found`)
      );
    }
  } catch (error) {}
});

router.get("/:userName/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findById(req.params.expId);

    if (experience) {
      res.status(200).send({success: true, data: experience});

    } else {
      res.status(404).send({success: false, message:  `Experience with ${req.params.expId} is not found`});

    }

  } catch (error) {
    next(error);
  }
});

router.put("/:userName/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByIdAndUpdate(req.params.expId, ...req.body , {new: true});

    if (experience) {
      res.status(200).send({success: true, data: experience});

    } else {
      res.status(404).send({success: false, message:  `Experience with ${req.params.expId} is not found`});

    }

  } catch (error) {
    next(error);
  }
});

router.delete("/:userName/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByIdAndDelete(req.params.expId);

    if (experience) {
      res.status(204).send({success: true, message: `Experience with ${req.params.expId} is deleted successfully`});

    } else {
      res.status(404).send({success: false, message:  `Experience with ${req.params.expId} is not found`});

    }

  } catch (error) {
    next(error);
  }
});

router.post("/:userName/experiences/:expId/picture", multer({storage: cloudinaryStorage}).single("image") , async (req, res, next) => {
  try {

    const experience = await ExperienceModel.findById(req.params.expId);

    if(experience){

      console.log(req.body)

      const {image} = req.body;

      experience.image = image;

      await experience.save();
      
      res.status(203).send({success: true, data: experience});

    } else {
      res.status(404).send({success: false, message: "Experience not found"});

    }

  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
});

router.get("/:userName/experiences/CSV", async (req, res, next) => {
  try {

  } catch (error) {

  }
});

// me profile
router.get("/me", async (req, res, next) => {
  try {
    const profile = await profileModel.find({
      name: "rashmi",
      surname: "hiremath",
    }).populate("experiences");
    res.status(200).send(profile);
  } catch (error) {
    next(error);
  }
});

// post rofile
router.post("/", async (req, res, next) => {
  try {
    const profile = await profileModel(req.body);
    const { _id } = await profile.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

// to get all profiles
router.get("/", async (req, res, next) => {
  try {
    const profiles = await profileModel.find();

    res.send(profiles);
  } catch (error) {
    next(error);
  }
});

// get single profile by id
router.get("/:profileId", async (req, res, next) => {
  try {
    const id = req.params.profileId;
    const profile = await profileModel.findById(id).populate("experiences");
    if (profile) {
      res.send(profile);
    } else {
      next(createHttpError(404, `profile with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// update single profile by id
router.put("/:profileId", async (req, res, next) => {
  try {
    const id = req.params.profileId;
    const profile = await profileModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (profile) {
      res.send(profile);
    } else {
      next(createHttpError(404, `profile with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});



// delete single profile by id
router.delete("/:profileId", async (req, res, next) => {
  try {
    const id = req.params.profileId;
    const deleteProfile = await profileModel.findByIdAndDelete(id);
    if (deleteProfile) {
      res.status(204).send("Deleted successfully");
    } else {
      next(createHttpError(404, `profile with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});



export default router;