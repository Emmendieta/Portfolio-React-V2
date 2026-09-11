import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const educationsSchema = new mongoose.Schema(
    {
        institutionName: { type: Map, of: String, required: true },
        title: { type: Map, of: String, required: true },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date },
        linkInstitution: { type: String },
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
        linkCertificate: { type: String },
        finished: { type: Boolean },
        typeEducation: {
            type: String,
            enum: ["Primary School", "High School", "University", "Course", "Conference", "Other"],
            required: true
        },
        description: { type: Map, of: String, required: true },
        habilities: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "habilities"
            }
        ],
        order: { type: Number , required: true, default: 1 }
        
    },
    { timestamps: true }
);

educationsSchema.plugin(paginate);

export const EducationModel = mongoose.model("educations", educationsSchema);