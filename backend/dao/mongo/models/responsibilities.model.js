import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const responsibilitiesSchema = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true },
    },
    { timestamps: true }
);

responsibilitiesSchema.plugin(paginate);

export const ResponsibilitiesModel = mongoose.model("responsibilities", responsibilitiesSchema);