import profileModel from "../../db/models/profile/ProfileModel.js";
import express from "express";
import ExperienceModel from "../../db/models/experience/ExperienceModel.js";
import createHttpError from "http-errors";

const router = express.Router();

router.post("/:userName/experiences", async (req, res, next) => {
  try {
   
      const experience = new ExperienceModel(req.body).save()
      console.log(experience)
      const newExperience = await profileModel.findByIdAndUpdate(
        req.params.userName,
        { $push: { experiences: experience._id } },
        { new: true }
      );
      if (newExperience) {
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
    const experiences = await ExperienceModel.findById(req.params.userName);
    if (experiences) {
      res.send(experiences);
    } else {
      next(
        createHttpError(404, `User with ${req.params.userName} is not found`)
      );
    }
  } catch (error) {}
});

router.get("/:userName/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findById(req.params.userName);
    if (experience) {
      const experienceToAdd = experience.experiences.find(
        (e) => e._id.toString() === req.params.expId
      );
      if (experienceToAdd) {
        res.send(experienceToAdd);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.expId} is not found`
          )
        );
      }
    } else {
      next(createHttpError(404`User with ${req.params.userName} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:userName/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findById(req.params.userName);

    if (experience) {
      const index = experience.experiences.findIndex(
        (e) => e._id.toString() === req.params.expId
      );

      if (index !== -1) {
        experience.experiences[index] = {
          ...experience.comment[index].toObject(),
          ...req.body,
        };
        await experience.save();
        res.send(experience);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.expId} is not found`
          )
        );
      }
    } else {
      next(
        createhttpError(404, `User with ${req.params.userName} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:userName/experiences/:expId", async (req, res, next) => {
  try {
    experienceToDelete = await ExperienceModel.findByIdAndUpdate(
      req.params.userName,
      { $pull: { experiences: { _id: req.params.expId } } },
      { new: true }
    );
    if (experienceToDelete) {
      res.send(experienceToDelete);
    } else {
      next(
        createHttpError(404, `User with ${req.params.userName} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:userName/experiences/:expId/picture", async (req, res, next) => {
  try {
  } catch (error) {}
});

router.get("/:userName/experiences/CSV", async (req, res, next) => {
  try {
  } catch (error) {}
});

// me profile
router.get("/me", async (req, res, next) => {
  try {
    const profile = await profileModel.find({
      name: "rashmi",
      surname: "hiremath",
    });
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
    const profile = await profileModel.findById(id);
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
