import express from 'express';
import PostModel from '../../db/models/post/PostModel.js';
import ProfileModel from '../../db/models/profile/ProfileModel.js';
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";


const { Router } = express;


const router = Router();


const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "linkedin-posts-images"
	}
})

/*  GET POSTS:
Retrieve posts
    - GET https://yourapi.herokuapp.com/api/posts/
*/

router.route("/")
.get(async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user');

        res.status(200).send({success: true, data: posts});
        
    } catch (error) {
        res.status(500).send({success: false, error: error.message})

    }
})


/*  Posting a new post:
Retrieve posts
    - GET https://yourapi.herokuapp.com/api/posts/:userId
*/

router.route("/:userId")
.post(async (req, res) => {
    try {
        const post = new PostModel(req.body);

        post.user = req.params.userId;

        await post.save();

        res.status(201).send({success: true, data: post})

    } catch (error) {
        res.status(500).send({success: false, error: error.message})

    }
})





/*    
Retrieves the specified post
    - GET https://yourapi.herokuapp.com/api/posts/{postId}

   
Edit a given post
    - PUT https://yourapi.herokuapp.com/api/posts/{postId}

   
Removes a post
    - DELETE https://yourapi.herokuapp.com/api/posts/{postId}

    
Add an image to the post under the name of "post"
    - POST https://yourapi.herokuapp.com/api/posts/{postId}
*/



router.route("/:postId")
.get(async (req, res) => {
    try {

        const getPostById = await PostModel.findById(req.params.postId).populate('user');

        if(getPostById) {
            res.status(200).send({success: true, data: getPostById});

        } else {
            res.status(404).send({success: false, error: "Post not found"})

        }
  
    } catch (error) {
        res.status(500).send({success: false, error: error.message})

    }
})
.put(async (req, res) => {
    try {

        const updatePost = await PostModel.findByIdAndUpdate(req.params.postId, req.body, {new: true});

        if(updatePost) {
            res.status(200).send({success: true, data: updatePost});
        } else {
            res.status(404).send({success: false,  message: "Post not found"});
        }
        
    } catch (error) {
        res.status(500).send({success: false, error: error.message})

    }
})
.delete(async (req, res) => {
    try {

        const deleteSelectedPost = await PostModel.findByIdAndDelete(req.params.postId);

        if(deleteSelectedPost){
            res.status(204).send({success: true, message: "Post Deleted Succesfully"});
        } else {
            res.status(404).send({success: false, message: "Post not found"});
        }

    } catch (error) {
        res.status(500).send({success: false, error: error.message})
        
    }
})
.post(multer({storage: cloudinaryStorage}).single("image") ,async (req, res) => {
    try {

        const getPostById = await PostModel.findById(req.params.postId);

        if(getPostById) {

            const { image } = req.body;

            getPostById.image = image;

            await getPostById.save();

            res.status(203).send({success: true, data: getPostById});

        } else {
            res.status(404).send({success: false, message: "Post not found"});

        }
        
    } catch (error) {
        res.status(500).send({success: false, error: error.message})
        
    }
})


export default router