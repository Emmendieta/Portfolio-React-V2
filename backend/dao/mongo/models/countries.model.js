import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const countriesSchema = new mongoose.Schema(
    {
        name: { type: Map, of: String, required: true, unique: true },
        provinces: [
            { type: mongoose.Schema.Types.ObjectId, ref: "provinces", required: true }
        ]
    },
    { timestamps: true }
);

countriesSchema.plugin(paginate);


export const CountriesModel = mongoose.model("countries", countriesSchema);