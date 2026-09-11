import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true },
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
        order: { type: Number, required: true, default: 1 }
    }, 
    { timestamps: true }
);

export const CategoriesModel = mongoose.model("categories", categoriesSchema);
