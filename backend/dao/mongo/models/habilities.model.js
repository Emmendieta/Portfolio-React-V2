import mongoose from "mongoose";
import paginate  from "mongoose-paginate-v2";

const habilitesSchema = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true }
    }, 
    { timestamps: true }
);

habilitesSchema.plugin(paginate);

export const HabilitesModel = mongoose.model("habilities", habilitesSchema);