import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const citiesSchema = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true },
        zipCode: { type: String, required: true }
    },
    { timestamps: true }
);

citiesSchema.plugin(paginate);

export const CitiesModel = mongoose.model("cities", citiesSchema);
