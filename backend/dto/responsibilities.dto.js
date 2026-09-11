const { PERSISTENCE } = process.env;
import crypto from "crypto";

class ResponsibilitiesDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this._id = data._id;
        this.name = data.name instanceof Map ? data.name: new Map(Object.entries(data.name || {}));
    };
};

export default ResponsibilitiesDTO;