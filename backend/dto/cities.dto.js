const { PERSISTENCE } = process.env;
import crypto from "crypto";

class CitiesDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this.name = data.name instanceof Map ? data.name: new Map(Object.entries(data.name || {}));
        this.zipCode = data.zipCode;
    };
};

export default CitiesDTO;