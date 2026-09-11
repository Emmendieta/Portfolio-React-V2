import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const rolesSchema = new mongoose.Schema(
    {
        role: { type: Map, of: String, required: true }, 
        permissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "permissions",
            required: true
        }]
    },
    {timestamps: true }
);

rolesSchema.plugin(paginate);

export const RolesModel = mongoose.model("roles", rolesSchema);