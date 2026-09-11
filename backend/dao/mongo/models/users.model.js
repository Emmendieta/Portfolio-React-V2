import mongoose from "mongoose";
import paginte from "mongoose-paginate-v2";

const usersSchema = new mongoose.Schema(
    {
        user: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        active: { type: Boolean, required: true },
        roles: [
            { type: mongoose.Schema.Types.ObjectId, ref: "roles", required: true }
        ],
        people: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "people",
        },
        extraPermission: [
            { type: mongoose.Schema.Types.ObjectId, ref: "permissions" }
        ],
        order: { type: Number, required: true , min: 0 }
    },
    { timestamps: true }
);

usersSchema.plugin(paginte);

export const UsersModel = mongoose.model("users", usersSchema);