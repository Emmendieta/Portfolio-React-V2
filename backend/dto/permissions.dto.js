const { PERSISTENCE } = process.env;
import crypto from "crypto";

class PermissionsDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this.key = data.key;
        this.name = data.name instanceof Map ? data.name: new Map(Object.entries(data.name || {}));
        this.description = data.description instanceof Map ? data.description: new Map(Object.entries(data.description || {}));
    };
};

export default PermissionsDTO;