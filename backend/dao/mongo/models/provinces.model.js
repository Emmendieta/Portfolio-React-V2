import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const provincesSchema = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true },
        cities: [
            { type: mongoose.Schema.Types.ObjectId, ref: "cities", required: true }
        ]
    },
    { timestamps: true }
);

provincesSchema.plugin(paginate);

export const ProvincesModel = mongoose.model("provinces", provincesSchema);