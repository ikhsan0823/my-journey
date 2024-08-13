import { Schema, model, models } from "mongoose";

const goalSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    goals: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    completionDate: {
        type: Date,
        required: true
    },
    steps: {
        type: Array
    }
}, { timestamps: true });

const Goal = models.Goal || model("Goal", goalSchema);

export default Goal;