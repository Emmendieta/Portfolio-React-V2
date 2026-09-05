const { PERSISTENCE } = process.env;
import crypto from "crypto";

class CountriesDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this.name = data.name instanceof Map ? data.name: new Map(Object.entries(data.name || {}));
        this.provinces = data.provinces;
    };
};

export default CountriesDTO;