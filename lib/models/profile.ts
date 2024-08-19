import { Schema, model, models } from "mongoose";

const profileSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: "-"
    },
    username: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        default: '-'
    },
    gender: {
        type: String,
        default: 'none'
    },
    phone: {
        type: String,
        default: '-'
    }
}, { timestamps: true });

const Profile = models.Profile || model("Profile", profileSchema);

export default Profile