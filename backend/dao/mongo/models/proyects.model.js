import mongoose from "mongoose";

const proyectsSchema = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date },
        company: { type: Map, of: String, required: true },
        linkProyect: { type: String },
        linkCompany: { type: String },
        description: { type: Map, of: String, required: true },
        skills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "skills",
        }],
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
        }],
        responsibilities: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "responsibilities"
        }],
        images: [
            {
                publicId: { type: String, required: true },
                url: { type: String, required: true },
                width: { type: Number },
                height: { type: Number },
                hash: { type: String, required: true },
                isMain: { type: Boolean, default: true }
            }
        ],
        order: { type: Number, required: true, default: 1 }
    },
    { timestamps: true }
);

export const ProyectsModel = mongoose.model("proyects", proyectsSchema);