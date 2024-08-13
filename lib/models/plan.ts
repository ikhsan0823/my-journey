import { Schema, model, models } from "mongoose";

const planSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
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

const Plan = models.Plan || model("Plan", planSchema);

export default Plan;