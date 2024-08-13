import { Schema, model, models } from "mongoose";

const todoSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    time: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Todo = models.Todo || model("Todo", todoSchema);

export default Todo;