import mongoose from "mongoose";

const socialMediasSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        url: { type: String, required: true },
        images: [
            { 
                publicId: { type: String },
                url: { type: String },
                width: { type: Number },
                height: { type: Number },
                hash: { type: String },
                isMain: { type: Boolean, default: true }
            }
        ],
        typeSocial: {
            type: String,
            enum: ["Contact", "Social"],
            required: true
        },
        user: { type: String },
        password: { type: String },
        order: { type: Number, required: true, default: 1 }
    }, { timestamps: true }
);

export const SocialMediasModel = mongoose.model("socialMedias", socialMediasSchema);