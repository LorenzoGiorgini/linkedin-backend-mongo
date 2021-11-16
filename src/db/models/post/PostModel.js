import mongoose from 'mongoose';

const { Schema , model } = mongoose;

/*
{
    "_id": 
    "text": 
    "username": 
    "user": {
        "_id": 
        "name": 
        "surname": 
        "email": 
        "bio": 
        "title": 
        "area": 
        "image": 
        "username": 
    }
    "image":
}
*/


const PostModel = new Schema({
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: ""
    },
    username: {
        type: String,
        required: true,
        default: "admin"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
    },
    comments: [{
        user: {type: Schema.Types.ObjectId, ref: 'Profile'},
        comment: {type: String, required: true},
    }, {timestamps: true}]
}, {
    timestamps: true
})


export default model('Post', PostModel);