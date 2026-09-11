import mongoose from "mongoose";

const skillsSchema  = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true },
        percent: { type: Number, required: true },
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
        type: {
            type: String,
            enum: ["Hard", "Soft"],
            required: true,
            default: "Hard"
        },
        order: { type: Number, required: true, default: 1 }
    },
    { timestamps: true }
);

export const SkillsModel  = mongoose.model("skills", skillsSchema );