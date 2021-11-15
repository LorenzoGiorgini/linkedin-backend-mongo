import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import CommentModel from "../../db/models/comments/CommentModel.js";

const { Router } = express;

const router = Router;

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "linkedin-comments-images"
    }
});

router.route('https://striveschool-api.herokuapp.com/api/posts/{id}/like')
    .post(async (req, res, next) => {
    try {

        const comment = new CommentModel(req.body)
        
        await comment.save();

        res.status(201).send({ success: true, data: comment });
        
    } catch {

        res.status(500).send({ success: false, error: error.message });

    }
});