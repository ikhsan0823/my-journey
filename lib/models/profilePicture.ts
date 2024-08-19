import { Schema, model, models } from "mongoose";

const profilePictureSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    secureUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ProfilePicture = models.ProfilePicture || model("ProfilePicture", profilePictureSchema);

export default ProfilePicture