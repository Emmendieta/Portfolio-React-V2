import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const continentsSchema = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true, unique: true },
        countries: [
            { type: mongoose.Schema.Types.ObjectId, ref: "countries" , required: true }
        ]
    },
    { timestamps: true }
);

continentsSchema.plugin(paginate);

export const ContientsModel = mongoose.model("continents", continentsSchema);