const { PERSISTENCE } = process.env;
import crypto from "crypto";

class RolesDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this.role = data.role instanceof Map ? data.role: new Map(Object.entries(data.role || {}));
        this.permissions = data.permissions;
    };
};

export default RolesDTO;