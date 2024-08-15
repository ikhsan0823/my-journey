import { Schema, model, models } from "mongoose";

const noteSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Note = models.Note || model("Note", noteSchema);

export default Note;