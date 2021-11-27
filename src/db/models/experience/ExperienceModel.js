import mongoose from "mongoose"

const { Schema, model} = mongoose

const experienceSchema = new Schema({
    role: {type: String, required: true},
    company: {type: String, required: true},
    startDate: {type: String, required: true},
    endDate: {type: String, default: null},
    description: {type: String,},
    area: {type: String, required: true},
    image: {type: String, default: 'https://i.stack.imgur.com/34AD2.jpg'}
},
{
    timestamps: true
}
)

export default model("Experience", experienceSchema)