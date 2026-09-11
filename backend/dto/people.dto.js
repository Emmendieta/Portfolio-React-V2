const { PERSISTENCE } = process.env;
import crypto from "crypto";

class PeopleDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this._id = data._id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.dni = data.dni;
        this.cuil = data.cuil;
        this.birthday = data.birthday;
        this.phone = data.phone;
        this.jobTitle = data.jobTitle instanceof Map ? data.jobTitle: new Map(Object.entries(data.jobTitle || {}));
        this.aboutMe = data.aboutMe instanceof Map ? data.aboutMe: new Map(Object.entries(data.aboutMe || {}));
        this.address = data.address;
        this.legalAddress = data.legalAddress;
        this.images = data.images;
        this.cities = data.cities;
        this.provinces = data.provinces;
        this.countries = data.countries;
        this.continents = data.continents;
    };
};

export default PeopleDTO;