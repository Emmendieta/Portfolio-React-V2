import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const permissionsSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true },
        name: { type: Map, of: String, required: true },
        description: { type: Map, of: String }
    },
    { timestamps: true }
);

permissionsSchema.plugin(paginate);

export const PermissionsModel = mongoose.model("permissions", permissionsSchema);