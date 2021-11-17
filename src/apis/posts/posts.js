import express from "express";
import PostModel from "../../db/models/post/PostModel.js";
import ProfileModel from "../../db/models/profile/ProfileModel.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const { Router } = express;

const router = Router();

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkedin-posts-images",
  },
});

/*  GET POSTS:
Retrieve posts
    - GET /api/posts/
*/

/*  Posting a new post:
Retrieve posts
    - GET /api/posts/:userId
*/

router.route("/").get(async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user");

    res.status(200).send({ success: true, data: posts });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
})
.post(async (req, res) => {
  try {
    const post = new PostModel(req.body);

    await post.save();

    res.status(201).send({ success: true, data: post });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});



/*    
Retrieves the specified post
    - GET /api/posts/{postId}

   
Edit a given post
    - PUT /api/posts/{postId}

   
Removes a post
    - DELETE /api/posts/{postId}

    
Add an image to the post under the name of "post"
    - POST /api/posts/{postId}
*/

/*
- GET /api/posts/{id}/comment

Retrieve the list of comments for a given post

- POST /api/posts/{id}/comment

Create the a new comment for a given post

- DELETE /api/posts/{id}/comment/{commentId}

Deletes a given comment

- PUT /api/posts/{id}/comment/{commentId}

Edit a given comment
 */

router
  .route("/:postId")
  .get(async (req, res) => {
    try {
      const getPostById = await PostModel.findById(req.params.postId).populate(
        "user"
      );

      if (getPostById) {
        res.status(200).send({ success: true, data: getPostById });
      } else {
        res.status(404).send({ success: false, error: "Post not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const updatePost = await PostModel.findByIdAndUpdate(
        req.params.postId,
        req.body,
        { new: true }
      );

      if (updatePost) {
        res.status(200).send({ success: true, data: updatePost });
      } else {
        res.status(404).send({ success: false, message: "Post not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const deleteSelectedPost = await PostModel.findByIdAndDelete(
        req.params.postId
      );

      if (deleteSelectedPost) {
        res
          .status(204)
          .send({ success: true, message: "Post Deleted Succesfully" });
      } else {
        res.status(404).send({ success: false, message: "Post not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  })
  .post(
    multer({ storage: cloudinaryStorage }).single("image"),
    async (req, res) => {
      console.log("update image??");
      try {
        const getPostById = await PostModel.findById(req.params.postId);

        if (getPostById) {
          getPostById.image = req.file.path;

          await getPostById.save();

          res.status(203).send({ success: true, data: getPostById });
        } else {
          res.status(404).send({ success: false, message: "Post not found" });
        }
      } catch (error) {
        res.status(500).send({ success: false, error: error.message });
      }
    }
  );

router
  .route("/:postId/comment")
  .get(async (req, res) => {
    try {
      const getComments = await PostModel.findById(req.params.postId).populate(
        "comments.user"
      );

      if (getComments) {
        res.status(200).send({ success: true, data: getComments.comments });
      } else {
        res.status(404).send({ success: false, error: "Post not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      console.log(req.body);

      const newComment = await PostModel.findByIdAndUpdate(
        req.params.postId,
        { $push: { comments: req.body } },
        { new: true }
      );

      if (newComment) {
        res.status(201).send({ success: true, data: newComment.comments });
      } else {
        res.status(400).send({ success: false, error: "Bad Request" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  });

router
  .route("/:postId/comment/:commentId")
  .delete(async (req, res) => {
    try {
      const deleteComment = await PostModel.findByIdAndUpdate(
        req.params.postId,
        { $pull: { comments: { _id: req.params.commentId } } },
        { new: true }
      );

      if (deleteComment) {
        res
          .status(204)
          .send({ success: true, message: "Comment Deleted Succesfully" });
      } else {
        res.status(404).send({ success: false, message: "Comment not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const updateComment = await PostModel.updateOne(
        {
          _id: req.params.postId,
          "comments._id": new mongoose.Types.ObjectId(req.params.commentId),
        },
        {
          $set: { "comments.$.comment": req.body.comment },
        },
        { new: true }
      );

      if (updateComment) {
        res.status(203).send({ success: true, data: updateComment.comments });
      } else {
        res.status(404).send({ success: false, message: "Comment not found" });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  });

/* - POST /api/posts/{id}/like

Like the post for current user (each user can like only once per post)

- DELETE /api/posts/{id}/like

Remove the like for current user */

router.route("/:postId/like").post(async (req, res) => {
  try {
    let getPostById = await PostModel.findById(req.params.postId);

    if (getPostById) {
      const alreadyLiked = await PostModel.findOne({
        _id: req.params.postId,
        "likes.user": new mongoose.Types.ObjectId(req.body.user),
      });

      if (!alreadyLiked) {
        await PostModel.findByIdAndUpdate(
          req.params.postId,
          {
            $push: { likes: { user: req.body.user } },
          },
          { new: true }
        );
      } else {
        await PostModel.findByIdAndUpdate(
          req.params.postId,
          {
            $pull: { likes: { user: req.body.user } },
          },
          { new: true }
        );
      }
    } else {
      res
        .status(404)
        .send({ success: false, message: "That post doesn't exist" });
    }

    getPostById = await PostModel.findById(req.params.postId);

    res.status(203).send({ success: true, data: getPostById });
  } catch (error) {
    res.status(404).send({ success: false, errorr: error.message });
  }
});

export default router;
