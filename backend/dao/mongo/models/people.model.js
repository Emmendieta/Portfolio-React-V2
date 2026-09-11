import mongoose from "mongoose";
import paginte from "mongoose-paginate-v2";

const peopleSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dni: { type: Number, min: 1, required: true, unique: true },
        cuil: { type: Number, min: 1, required: true, unique: true },
        birthday: { type: Date, required: true },
        phone: { type: Number, required: true },
        jobTitle: { type: Map, of: String },
        aboutMe: { type: Map, of: String },
        address: {
            street: { type: String, required: true },
            number: { type: Number, min: 0, required: true },
            floor: { type: Number },
            aparment: { type: String }
        },
        legalAddress: {
            street: { type: String, required: true },
            number: { type: Number, min: 0, required: true },
            floor: { type: Number },
            aparment: { type: String }
        },
        images: [
            {
                publicId: { type: String, required: true },
                url: { type: String, required: true },
                width: { type: Number },
                height: { type: Number },
                hash: { type: String, required: true },
                isMain: { type: Boolean, default: false }
            }
        ],
        cities: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cities",
        },
        provinces: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "provinces",
        },
        countries: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "countries",
        },
        continents: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "continents",
        }
    },
    {
        timestamps: true,
        collection: "people",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

peopleSchema.virtual("age").get(function () {
    if (!this.birthday) return null;

    const today = new Date();
    let age = today.getFullYear() - this.birthday.getFullYear();
    const m = today.getMonth() - this.birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthday.getDate())) {
        age--;
    };
    return age;
});

peopleSchema.plugin(paginte);

export const PeopleModel = mongoose.model("people", peopleSchema);