import { Schema, model, models } from "mongoose";

const imageSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Image = models.Image || model("Image", imageSchema);

export default Image;